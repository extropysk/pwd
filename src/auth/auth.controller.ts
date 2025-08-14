import {
  Body,
  Controller,
  Get,
  MessageEvent,
  Param,
  Post,
  Query,
  Res,
  Sse,
  UseGuards,
} from '@nestjs/common'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'
import { Response } from 'express'
import { Observable, fromEvent, map } from 'rxjs'
import { Cookies } from 'src/auth/decorators/cookies.decorator'
import { Session } from 'src/auth/decorators/session.decorator'
import { AuthState, State } from 'src/auth/decorators/state.decorator'
import { CallbackDto } from 'src/auth/dto/callback.dto'
import { ChallengeDto } from 'src/auth/dto/challenge.dto'
import { EmptyDto } from 'src/auth/dto/empty.dto'
import { IssuerDto } from 'src/auth/dto/issuer.dto'
import { TokenDto } from 'src/auth/dto/token.dto'
import { Status } from 'src/auth/enums/status.enums'
import { GoogleAuthGuard } from 'src/auth/guards/google.guard'
import { SESSION_COOKIE_NAME } from 'src/auth/guards/session.guard'
import { Current } from 'src/core/decorators/current.decorator'
import { PayloadDto } from 'src/core/dto/payload.dto'
import { Payload } from 'src/core/interfaces/payload.interface'
import { AuthService } from './auth.service'
import { LoginDto } from 'src/auth/dto/login.dto'

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService, private eventEmitter: EventEmitter2) {}

  @ApiOperation({ summary: 'Get JWT token' })
  @ApiOkResponse({ type: TokenDto })
  @Get('token')
  @Session()
  async getToken(@Current() current) {
    return this.authService.getToken(current)
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
    description: 'SEE called when user is logged in.',
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

  @Get('google')
  @UseGuards(GoogleAuthGuard)
  async googleAuth(
    @Res({ passthrough: true }) response: Response,
    @Current() current: Payload,
    @State() state: AuthState
  ) {
    await this.authService.createSession(current, response)
    if (state.callback) {
      return response.redirect(state.callback)
    }

    return current
  }

  @Post('/login')
  @ApiOperation({ summary: 'Login' })
  @ApiOkResponse({ type: TokenDto })
  async login(@Body() loginDto: LoginDto, @Res({ passthrough: true }) response: Response) {
    return await this.authService.login(loginDto, response)
  }
}
