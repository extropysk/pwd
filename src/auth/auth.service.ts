import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { JwtService } from "@nestjs/jwt";
import { randomBytes } from "crypto";
import { Response } from "express";
import * as lnurl from "lnurl";
import * as ms from "ms";
import { UserDto } from "src/auth/dto/user.dto";

export const SESSION_COOKIE_NAME = "session";
export const JWT_COOKIE_NAME = "jwt";

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private eventEmitter: EventEmitter2
  ) {}

  async verify(k1: string, sig: string, key: string, response: Response) {
    if (!lnurl.verifyAuthorizationSignature(sig, k1, key)) {
      throw new Error("Signature verification failed");
    }

    const payload = { sub: key };
    const token = await this.jwtService.signAsync(payload);

    response.cookie(JWT_COOKIE_NAME, token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      domain: this.configService.get<string>("COOKIES_DOMAIN"),
      expires: new Date(
        Date.now() + ms(this.configService.get<string>("JWT_EXPIRATION"))
      ),
    });
    this.eventEmitter.emit(k1, new UserDto(key));
  }

  getSecret(host: string, response: Response) {
    const k1 = randomBytes(32).toString("hex");

    const params = new URLSearchParams({
      k1,
      tag: "login",
    });
    const callbackUrl = `${host}/auth/verify?${params.toString()}`;

    response.cookie(SESSION_COOKIE_NAME, k1, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      domain: this.configService.get<string>("COOKIES_DOMAIN"),
    });
    return { k1, lnurl: lnurl.encode(callbackUrl).toUpperCase() };
  }
}
