import { Controller, Get, MessageEvent, Param, Post, Query, Res, Sse } from '@nestjs/common'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'
import { Response } from 'express'
import { Observable, fromEvent, map } from 'rxjs'
import { Session } from 'src/auth/decorators/session.decorator'
import { CallbackDto } from 'src/auth/dto/callback.dto'
import { ChallengeDto } from 'src/auth/dto/challenge.dto'
import { IssuerDto } from 'src/auth/dto/issuer.dto'
import { TokenDto } from 'src/auth/dto/token.dto'
import { Status } from 'src/auth/enums/status.enums'
import { SESSION_COOKIE_NAME } from 'src/auth/guards/session.guard'
import { Cookies } from 'src/core/decorators/cookies.decorator'
import { Current } from 'src/core/decorators/current.decorator'
import { EmptyDto } from 'src/core/dto/empty.dto'
import { PayloadDto } from 'src/core/dto/payload.dto'
import { AuthService } from './auth.service'

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService, private eventEmitter: EventEmitter2) {}

  @ApiOperation({ summary: 'Get JWT token' })
  @ApiOkResponse({ type: TokenDto })
  @Get('token')
  @Session()
  async getToken(@Current() current, @Res({ passthrough: true }) response: Response) {
    return this.authService.getToken(current, response)
  }

  @Post('/logout')
  @ApiOperation({ summary: 'Logout' })
  @ApiOkResponse({ type: EmptyDto })
  @Session()
  async logout(
    @Cookies(SESSION_COOKIE_NAME) session: string,
    @Res({ passthrough: true }) response: Response
  ) {
    await this.authService.logout(session, response)
    return {}
  }

  @ApiOperation({ summary: 'LN wallet callback' })
  @ApiOkResponse({ type: CallbackDto })
  @Get('callback')
  async callback(@Query('k1') k1: string, @Query('sig') sig: string, @Query('key') key: string) {
    try {
      await this.authService.callback(k1, sig, key)
      return { status: Status.Ok }
    } catch (error) {
      return { status: Status.Error, reason: error.message }
    }
  }

  @ApiOperation({ summary: 'Get challenge' })
  @ApiOkResponse({ type: ChallengeDto })
  @Get('challenge')
  async getChallenge(@Res({ passthrough: true }) response: Response) {
    return await this.authService.getChallenge(response)
  }

  @ApiOperation({
    summary: 'SSE',
    description: 'SEE called when user is logged in. ID is k1 returned from challenge.',
  })
  @ApiOkResponse({ type: PayloadDto })
  @Sse('sse/:id')
  sse(@Param('id') id: string): Observable<MessageEvent> {
    return fromEvent(this.eventEmitter, id).pipe(map((data: CallbackDto) => ({ data })))
  }

  @ApiOperation({
    summary: 'Get issuer',
    description: 'Get public key, that can be used for JWT token verification.',
  })
  @ApiOkResponse({ type: IssuerDto, description: 'Public key' })
  @Get('issuer')
  async getIssuer() {
    return await this.authService.getIssuer()
  }
}
