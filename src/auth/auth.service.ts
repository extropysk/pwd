import { Inject, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { JwtService } from '@nestjs/jwt'
import { randomBytes } from 'crypto'
import { Response } from 'express'
import * as lnurl from 'lnurl'
import { Db, Filter, ObjectId } from 'mongodb'
import { COOKIE_OPTIONS } from 'src/auth/decorators/cookies.decorator'
import { CallbackDto } from 'src/auth/dto/callback.dto'
import { LoginDto } from 'src/auth/dto/login.dto'
import { Status } from 'src/auth/enums/status.enums'
import { SESSION_COOKIE_NAME } from 'src/auth/guards/session.guard'
import { Challenge } from 'src/auth/interfaces/challenge.interface'
import { Issuer } from 'src/auth/interfaces/issuer.interface'
import { Session } from 'src/auth/interfaces/session.interface'
import { Token } from 'src/auth/interfaces/token.interface'
import { expToDate } from 'src/auth/utils/date-utils'
import { Payload } from 'src/core/interfaces/payload.interface'
import { DATABASE } from 'src/db/database.module'

const COLLECTION = 'sessions'

@Injectable()
export class AuthService {
  constructor(
    @Inject(DATABASE)
    private db: Db,
    private jwtService: JwtService,
    private configService: ConfigService,
    private eventEmitter: EventEmitter2
  ) {}

  async logout(session: string, response: Response) {
    await this.db.collection<Session>(COLLECTION).deleteOne({ _id: new ObjectId(session) })

    const domain = this.configService.get<string>('COOKIES_DOMAIN')
    response.cookie(SESSION_COOKIE_NAME, '', {
      ...COOKIE_OPTIONS,
      domain,
      expires: new Date(),
    })
  }

  async getToken(payload: Payload): Promise<Token> {
    const jwt = await this.jwtService.signAsync(payload, {
      expiresIn: this.configService.get<string>('JWT_EXPIRATION'),
      privateKey: this.configService.get<string>('JWT_PRIVATE_KEY'),
      algorithm: 'ES256',
    })
    return { ...payload, access_token: jwt }
  }

  async findOne(filter: Filter<Session>) {
    return await this.db
      .collection<Session>(COLLECTION)
      .findOne({ $and: [filter, { expired: { $gt: new Date() } }] })
  }

  async callback(k1: string, sig: string, key: string) {
    const session = await this.findOne({ k1 })
    if (!session) {
      throw new Error('Unauthorized')
    }

    if (!lnurl.verifyAuthorizationSignature(sig, k1, key)) {
      throw new Error('Signature verification failed')
    }

    const payload: Payload = { sub: key, permissions: {} }
    await this.db.collection<Session>(COLLECTION).updateOne(
      { _id: session._id },
      {
        $set: {
          payload,
          expired: expToDate(this.configService.get<string>('SESSION_EXPIRATION')),
        },
      }
    )
    this.eventEmitter.emit(session._id.toString(), new CallbackDto(Status.Ok))
  }

  async login(loginDto: LoginDto, response: Response): Promise<Token> {
    const expired = expToDate(this.configService.get<string>('SESSION_EXPIRATION'))
    const payload: Payload = {
      sub: loginDto.email,
      permissions: {},
    }

    const { insertedId } = await this.db.collection<Session>(COLLECTION).insertOne({
      expired,
      payload,
    })

    response.cookie(SESSION_COOKIE_NAME, insertedId.toString(), {
      ...COOKIE_OPTIONS,
      domain: this.configService.get<string>('COOKIES_DOMAIN'),
      expires: expired,
    })
    return this.getToken(payload)
  }

  async getChallenge(response: Response): Promise<Challenge> {
    const k1 = randomBytes(32).toString('hex')

    const params = new URLSearchParams({
      k1,
      tag: 'login',
    })
    const appUrl = this.configService.get<string>('APP_URL')
    const callbackUrl = `${appUrl}/auth/callback?${params.toString()}`

    const session: Session = {
      k1,
      expired: expToDate('10m'),
    }
    const { insertedId } = await this.db.collection<Session>(COLLECTION).insertOne(session)

    response.cookie(SESSION_COOKIE_NAME, insertedId.toString(), {
      ...COOKIE_OPTIONS,
      domain: this.configService.get<string>('COOKIES_DOMAIN'),
      expires: expToDate(this.configService.get<string>('SESSION_EXPIRATION')),
    })
    return { k1, lnurl: lnurl.encode(callbackUrl).toUpperCase(), id: insertedId.toString() }
  }

  getIssuer(): Issuer {
    const jwtKey = this.configService.get<string>('JWT_PUBLIC_KEY')
    return { jwtKey }
  }
}
