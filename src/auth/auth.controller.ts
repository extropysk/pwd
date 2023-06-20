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
import { Response } from "express";
import { Observable, fromEvent, map } from "rxjs";
import { Current } from "src/auth/decorators/current.decorator";
import { Host } from "src/auth/decorators/host.decorator";
import { PayloadDto } from "src/auth/dto/payload.dto";
import { Status } from "src/auth/enums/status.enums";
import { JwtGuard } from "src/auth/guards/jwt.guard";
import { SessionGuard } from "src/auth/guards/session.guard";
import { AuthService } from "./auth.service";

@Controller("auth")
export class AuthController {
  constructor(
    private authService: AuthService,
    private eventEmitter: EventEmitter2
  ) {}

  @Get("profile")
  @UseGuards(JwtGuard)
  getProfile(@Current() current) {
    return current;
  }

  @Get("token")
  @UseGuards(SessionGuard)
  async getToken(
    @Current() current,
    @Res({ passthrough: true }) response: Response
  ) {
    return this.authService.getToken(current, response);
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
  async getLnurl(
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
