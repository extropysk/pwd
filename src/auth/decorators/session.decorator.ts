import { applyDecorators, UseGuards } from "@nestjs/common";
import { ApiCookieAuth, ApiUnauthorizedResponse } from "@nestjs/swagger";
import {
  SESSION_COOKIE_NAME,
  SessionGuard,
} from "src/auth/guards/session.guard";

export function Session() {
  return applyDecorators(
    UseGuards(SessionGuard),
    ApiCookieAuth(SESSION_COOKIE_NAME),
    ApiUnauthorizedResponse({ description: "Unauthorized" })
  );
}
