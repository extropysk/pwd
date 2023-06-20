import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { JwtService } from "@nestjs/jwt";
import { randomBytes } from "crypto";
import { Response } from "express";
import * as lnurl from "lnurl";
import { PayloadDto } from "src/auth/dto/payload.dto";
import { JWT_COOKIE_NAME } from "src/auth/guards/jwt.guard";
import {
  SESSION_COOKIE_NAME,
  SESSION_PREFIX,
} from "src/auth/guards/session.guard";
import { Payload } from "src/auth/interfaces/payload.interface";
import { Token } from "src/auth/interfaces/token.interface";
import { StorageService } from "src/storage/storage.service";
import { expToDate } from "src/utils/date-utils";

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private eventEmitter: EventEmitter2,
    private storageService: StorageService
  ) {}

  async getToken(payload: Payload, response: Response) {
    const jwt = await this.jwtService.signAsync(payload);
    response.cookie(JWT_COOKIE_NAME, jwt, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      domain: this.configService.get<string>("COOKIES_DOMAIN"),
      expires: expToDate(this.configService.get<string>("JWT_EXPIRATION")),
    });
    const token: Token = { ...payload, access_token: jwt };
    return token;
  }

  async callback(k1: string, sig: string, key: string) {
    const session = await this.storageService.get(`${SESSION_PREFIX}/${k1}`);
    if (!session) {
      throw new Error("Unauthorized");
    }

    if (!lnurl.verifyAuthorizationSignature(sig, k1, key)) {
      throw new Error("Signature verification failed");
    }

    const payload: Payload = { sub: key };
    await this.storageService.set(`${SESSION_PREFIX}/${k1}`, payload);
    this.eventEmitter.emit(k1, new PayloadDto(payload));
  }

  async getLnurl(host: string, response: Response) {
    const k1 = randomBytes(32).toString("hex");

    const params = new URLSearchParams({
      k1,
      tag: "login",
    });
    const callbackUrl = `${host}/auth/callback?${params.toString()}`;

    await this.storageService.set(`${SESSION_PREFIX}/${k1}`, {}, "10m");
    response.cookie(SESSION_COOKIE_NAME, k1, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      domain: this.configService.get<string>("COOKIES_DOMAIN"),
      expires: expToDate(this.configService.get<string>("SESSION_EXPIRATION")),
    });
    return { k1, lnurl: lnurl.encode(callbackUrl).toUpperCase() };
  }
}
