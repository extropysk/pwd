import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy, VerifyCallback } from 'passport-google-oauth2'
import { Payload } from 'src/core/interfaces/payload.interface'
import { UsersService } from 'src/users/users.service'

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private configService: ConfigService, private usersService: UsersService) {
    super({
      clientID: configService.get('GOOGLE_ID'),
      clientSecret: configService.get('GOOGLE_SECRET'),
      callbackURL: `${configService.get('APP_URL')}/auth/google`,
      scope: ['profile', 'email'],
    })
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: any,
    done: VerifyCallback
  ): Promise<any> {
    const { emails } = profile

    const payload: Payload = {
      sub: emails[0].value,
    }
    done(null, payload)
  }
}
