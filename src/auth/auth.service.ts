import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { JwtService } from '@nestjs/jwt'
import { randomBytes } from 'crypto'
import { Response } from 'express'
import * as lnurl from 'lnurl'
import { COOKIE_OPTIONS } from 'src/auth/decorators/cookies.decorator'
import { CallbackDto } from 'src/auth/dto/callback.dto'
import { Status } from 'src/auth/enums/status.enums'
import { SESSION_COOKIE_NAME, SESSION_PREFIX } from 'src/auth/guards/session.guard'
import { Challenge } from 'src/auth/interfaces/challenge.interface'
import { Issuer } from 'src/auth/interfaces/issuer.interface'
import { Token } from 'src/auth/interfaces/token.interface'
import { expToDate } from 'src/auth/utils/date-utils'
import { Payload } from 'src/core/interfaces/payload.interface'
import { StorageService } from 'src/storage/storage.service'

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private eventEmitter: EventEmitter2,
    private storageService: StorageService
  ) {}

  async logout(k1: string, response: Response) {
    await this.storageService.del(`${SESSION_PREFIX}/${k1}`)

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

  async callback(k1: string, sig: string, key: string) {
    const session = await this.storageService.get(`${SESSION_PREFIX}/${k1}`)
    if (!session) {
      throw new Error('Unauthorized')
    }

    if (!lnurl.verifyAuthorizationSignature(sig, k1, key)) {
      throw new Error('Signature verification failed')
    }

    const payload: Payload = { sub: key, roles: [] }
    await this.storageService.set(`${SESSION_PREFIX}/${k1}`, payload)
    this.eventEmitter.emit(k1, new CallbackDto(Status.Ok))
  }

  async getChallenge(response: Response): Promise<Challenge> {
    const k1 = randomBytes(32).toString('hex')

    const params = new URLSearchParams({
      k1,
      tag: 'login',
    })
    const appUrl = this.configService.get<string>('APP_URL')
    const callbackUrl = `${appUrl}/auth/callback?${params.toString()}`

    await this.storageService.set(`${SESSION_PREFIX}/${k1}`, {}, '10m')
    response.cookie(SESSION_COOKIE_NAME, k1, {
      ...COOKIE_OPTIONS,
      domain: this.configService.get<string>('COOKIES_DOMAIN'),
      expires: expToDate(this.configService.get<string>('SESSION_EXPIRATION')),
    })
    return { k1, lnurl: lnurl.encode(callbackUrl).toUpperCase() }
  }

  getIssuer(): Issuer {
    const jwtKey = this.configService.get<string>('JWT_PUBLIC_KEY')
    return { jwtKey }
  }
}
