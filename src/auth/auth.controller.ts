import {
  Controller,
  Get,
  MessageEvent,
  Param,
  Query,
  Res,
  Sse,
  UseGuards,
} from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { Response } from "express";
import { Observable, fromEvent, map } from "rxjs";
import { Current } from "src/auth/decorators/current.decorator";
import { Host } from "src/auth/decorators/host.decorator";
import { CallbackDto } from "src/auth/dto/callback.dto";
import { ChallengeDto } from "src/auth/dto/challenge.dto";
import { PayloadDto } from "src/auth/dto/payload.dto";
import { TokenDto } from "src/auth/dto/token.dto";
import { Status } from "src/auth/enums/status.enums";
import { JwtGuard } from "src/auth/guards/jwt.guard";
import { SessionGuard } from "src/auth/guards/session.guard";
import { AuthService } from "./auth.service";

@ApiTags("auth")
@Controller("auth")
export class AuthController {
  constructor(
    private authService: AuthService,
    private eventEmitter: EventEmitter2
  ) {}

  @ApiOkResponse({ type: PayloadDto })
  @Get("profile")
  @UseGuards(JwtGuard)
  getProfile(@Current() current) {
    return current;
  }

  @ApiOkResponse({ type: TokenDto })
  @Get("token")
  @UseGuards(SessionGuard)
  async getToken(
    @Current() current,
    @Res({ passthrough: true }) response: Response
  ) {
    return this.authService.getToken(current, response);
  }

  @ApiOkResponse({ type: CallbackDto })
  @Get("callback")
  async callback(
    @Query("k1") k1: string,
    @Query("sig") sig: string,
    @Query("key") key: string
  ) {
    try {
      await this.authService.callback(k1, sig, key);
      return { status: Status.Ok };
    } catch (error) {
      return { status: Status.Error, reason: error.message };
    }
  }

  @ApiOkResponse({ type: ChallengeDto })
  @Get("challenge")
  async getChallenge(
    @Host() host: string,
    @Res({ passthrough: true }) response: Response
  ) {
    return await this.authService.getChallenge(host, response);
  }

  @ApiOkResponse({ type: PayloadDto })
  @Sse("sse/:id")
  sse(@Param("id") id: string): Observable<MessageEvent> {
    return fromEvent(this.eventEmitter, id).pipe(
      map((data: PayloadDto) => ({ data }))
    );
  }
}
