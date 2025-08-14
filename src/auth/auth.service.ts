import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { randomBytes } from 'crypto'
import { Response } from 'express'
import * as lnurl from 'lnurl'
import { CallbackDto } from 'src/auth/dto/callback.dto'
import { LoginDto } from 'src/auth/dto/login.dto'
import { Status } from 'src/auth/enums/status.enums'
import { SESSION_COOKIE_NAME, SESSION_PREFIX } from 'src/auth/guards/session.guard'
import { Challenge } from 'src/auth/interfaces/challenge.interface'
import { Token } from 'src/auth/interfaces/token.interface'
import { expToDate } from 'src/auth/utils/date-utils'
import { Payload } from 'src/core/interfaces/payload.interface'
import { StorageService } from 'src/storage/storage.service'
import * as crypto from 'crypto'
import * as jwt from 'jsonwebtoken'
import { JwtConfig } from 'src/configuration'

@Injectable()
export class AuthService {
  constructor(
    private configService: ConfigService,
    private eventEmitter: EventEmitter2,
    private storageService: StorageService
  ) {}

  async setCookie(response: Response, value: string, expires: Date) {
    response.cookie(SESSION_COOKIE_NAME, value, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      expires,
    })
  }

  async createSession(payload: Payload, response: Response) {
    const id = randomBytes(32).toString('hex')
    const expired = expToDate(this.configService.get<string>('session.expiration'))

    await this.storageService.set(`${SESSION_PREFIX}/${id}`, payload)
    this.setCookie(response, id, expired)
  }

  async logout(session: string, response: Response) {
    await this.storageService.del(`${SESSION_PREFIX}/${session}`)
    this.setCookie(response, '', new Date())
  }

  async getToken(payload: Payload): Promise<Token> {
    const jwtConfig = this.configService.get<JwtConfig>('jwt')

    const secret = crypto.createHash('sha256').update(jwtConfig.secret).digest('hex').slice(0, 32)
    const token = jwt.sign(payload, secret, {
      expiresIn: jwtConfig.expiration,
    })
    return { ...payload, access_token: token }
  }

  async login(loginDto: LoginDto, response: Response): Promise<Token> {
    const payload: Payload = {
      sub: loginDto.email,
      email: loginDto.email,
    }
    await this.createSession(payload, response)
    return await this.getToken(payload)
  }

  async callback(k1: string, sig: string, key: string) {
    const session = await this.storageService.get(`${SESSION_PREFIX}/${k1}`)
    if (!session) {
      throw new Error('Unauthorized')
    }

    if (!lnurl.verifyAuthorizationSignature(sig, k1, key)) {
      throw new Error('Signature verification failed')
    }

    const payload: Payload = { sub: key, email: '' }
    await this.storageService.set(`${SESSION_PREFIX}/${k1}`, payload)
    this.eventEmitter.emit(k1, new CallbackDto(Status.Ok))
  }

  async getChallenge(response: Response): Promise<Challenge> {
    const k1 = randomBytes(32).toString('hex')

    const params = new URLSearchParams({
      k1,
      tag: 'login',
    })
    const appUrl = this.configService.get<string>('app.url')
    const callbackUrl = `${appUrl}/auth/callback?${params.toString()}`

    await this.storageService.set(`${SESSION_PREFIX}/${k1}`, {}, '10m')
    const expired = expToDate(this.configService.get<string>('session.expiration'))
    this.setCookie(response, k1, expired)

    return { k1, lnurl: lnurl.encode(callbackUrl).toUpperCase(), id: k1 }
  }
}
