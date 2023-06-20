import {
  Controller,
  Get,
  MessageEvent,
  Param,
  Query,
  Res,
  Sse,
} from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { Response } from "express";
import { Observable, fromEvent, map } from "rxjs";
import { Auth } from "src/auth/decorators/auth.decorator";
import { Cookies } from "src/auth/decorators/cookies.decorator";
import { Current } from "src/auth/decorators/current.decorator";
import { Host } from "src/auth/decorators/host.decorator";
import { PayloadDto } from "src/auth/dto/payload.dto";
import { Status } from "src/auth/enums/status.enums";
import { AuthService, SESSION_COOKIE_NAME } from "./auth.service";

@Controller("auth")
export class AuthController {
  constructor(
    private authService: AuthService,
    private eventEmitter: EventEmitter2
  ) {}

  @Get("profile")
  @Auth()
  getProfile(@Current() current) {
    return { key: current.sub };
  }

  @Get("token")
  async getToken(
    @Cookies(SESSION_COOKIE_NAME) session: string,
    @Res({ passthrough: true }) response: Response
  ) {
    return this.authService.getToken(session, response);
  }

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

  @Get("lnurl")
  async secret(
    @Host() host: string,
    @Res({ passthrough: true }) response: Response
  ) {
    return await this.authService.getLnurl(host, response);
  }

  @Sse("sse/:id")
  sse(@Param("id") id: string): Observable<MessageEvent> {
    return fromEvent(this.eventEmitter, id).pipe(
      map((data: PayloadDto) => ({ data }))
    );
  }
}
