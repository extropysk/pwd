import { applyDecorators, UseGuards } from "@nestjs/common";
import { ApiCookieAuth, ApiUnauthorizedResponse } from "@nestjs/swagger";
import { JWT_COOKIE_NAME, JwtGuard } from "src/auth/guards/jwt.guard";

export function Jwt() {
  return applyDecorators(
    UseGuards(JwtGuard),
    ApiCookieAuth(JWT_COOKIE_NAME),
    ApiUnauthorizedResponse({ description: "Unauthorized" })
  );
}
