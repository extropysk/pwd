import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common'
import { ApiCookieAuth, ApiUnauthorizedResponse } from '@nestjs/swagger'
import { JWT_COOKIE_NAME, JwtGuard } from 'src/core/guards/jwt.guard'

export const ROLES_KEY = 'roles'

export function Jwt(...roles: string[]) {
  return applyDecorators(
    SetMetadata(ROLES_KEY, roles),
    UseGuards(JwtGuard),
    ApiCookieAuth(JWT_COOKIE_NAME),
    ApiUnauthorizedResponse({ description: 'Unauthorized' })
  )
}
