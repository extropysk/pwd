import { Controller, Get, Query, Res } from "@nestjs/common";
import { Response } from "express";
import { Auth } from "src/auth/decorators/auth.decorator";
import { Current } from "src/auth/decorators/current.decorator";
import { Host } from "src/auth/decorators/host.decorator";
import { Status } from "src/auth/enums/status.enums";
import { AuthService } from "./auth.service";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get("profile")
  @Auth()
  getProfile(@Current() current) {
    return { key: current.sub };
  }

  @Get("verify")
  async verify(
    @Query("k1") k1: string,
    @Query("sig") sig: string,
    @Query("key") key: string,
    @Res({ passthrough: true }) response: Response
  ) {
    try {
      await this.authService.verify(k1, sig, key, response);
      return { status: Status.Ok };
    } catch (error) {
      return { status: Status.Error, reason: error.message };
    }
  }

  @Get("secret")
  async secret(
    @Host() host: string,
    @Res({ passthrough: true }) response: Response
  ) {
    return await this.authService.getSecret(host, response);
  }
}
