import { applyDecorators, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiForbiddenResponse, ApiUnauthorizedResponse } from '@nestjs/swagger'
import { JwtGuard } from 'src/core/guards/jwt.guard'

export function Auth() {
  return applyDecorators(
    UseGuards(JwtGuard),
    ApiBearerAuth(),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
    ApiForbiddenResponse({ description: 'Forbidden' })
  )
}
