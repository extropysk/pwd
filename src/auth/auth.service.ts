import { Inject, Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'
import { randomBytes } from 'crypto'
import { Response } from 'express'
import * as lnurl from 'lnurl'
import { Db, Filter, ObjectId } from 'mongodb'
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
import { Base, WithoutId } from 'src/db/interfaces/base.interface'
import { UsersService } from 'src/users/users.service'

const COLLECTION = 'sessions'

@Injectable()
export class AuthService {
  constructor(
    @Inject(DATABASE)
    private db: Db,
    private jwtService: JwtService,
    private configService: ConfigService,
    private usersService: UsersService,
    private eventEmitter: EventEmitter2
  ) {}

  async setCookie(response: Response, value: string, expires: Date) {
    response.cookie(SESSION_COOKIE_NAME, value, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      domain: this.configService.get<string>('COOKIES_DOMAIN'),
      expires,
    })
  }

  async logout(session: string, response: Response) {
    await this.db.collection<Session>(COLLECTION).deleteOne({ _id: new ObjectId(session) })
    this.setCookie(response, '', new Date())
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

  async insert(session: WithoutId<Session>): Promise<Base> {
    const { insertedId: _id } = await this.db
      .collection<WithoutId<Session>>(COLLECTION)
      .insertOne(session)
    return { _id }
  }

  async callback(k1: string, sig: string, key: string) {
    const session = await this.findOne({ k1 })
    if (!session) {
      throw new Error('Unauthorized')
    }

    if (!lnurl.verifyAuthorizationSignature(sig, k1, key)) {
      throw new Error('Signature verification failed')
    }

    let user = await this.usersService.findOne({ 'ln.id': key })
    if (!user) {
      user = await this.usersService.insert({
        ln: { id: key },
        email: `${key}`,
      })
    }

    const payload: Payload = { sub: user._id.toString(), permissions: user.permissions ?? {} }
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

  async createSession(payload: Payload, response: Response) {
    const expired = expToDate(this.configService.get<string>('SESSION_EXPIRATION'))

    const { _id } = await this.insert({
      expired,
      payload,
    })
    this.setCookie(response, _id.toString(), expired)
  }

  async login(loginDto: LoginDto, response: Response): Promise<Token> {
    let user = await this.usersService.findOne({ email: loginDto.email })
    if (user) {
      if (!user.password || !(await bcrypt.compare(loginDto.password, user.password))) {
        throw new UnauthorizedException()
      }
    } else {
      user = await this.usersService.insert(loginDto)
    }

    const payload: Payload = {
      sub: user._id.toString(),
      permissions: user.permissions ?? {},
    }
    await this.createSession(payload, response)
    return await this.getToken(payload)
  }

  async getChallenge(response: Response): Promise<Challenge> {
    const k1 = randomBytes(32).toString('hex')

    const params = new URLSearchParams({
      k1,
      tag: 'login',
    })
    const appUrl = this.configService.get<string>('APP_URL')
    const callbackUrl = `${appUrl}/auth/callback?${params.toString()}`

    const { _id } = await this.insert({
      k1,
      expired: expToDate('10m'),
    })

    const expired = expToDate(this.configService.get<string>('SESSION_EXPIRATION'))
    this.setCookie(response, _id.toString(), expired)
    return { k1, lnurl: lnurl.encode(callbackUrl).toUpperCase(), id: _id.toString() }
  }

  getIssuer(): Issuer {
    const jwtKey = this.configService.get<string>('JWT_PUBLIC_KEY')
    return { jwtKey }
  }
}
