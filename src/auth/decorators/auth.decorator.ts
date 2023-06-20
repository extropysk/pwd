import { applyDecorators, UseGuards } from "@nestjs/common";
import { AuthGuard } from "src/auth/auth.guard";

export function Auth() {
  return applyDecorators(UseGuards(AuthGuard));
}
