import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiForbiddenResponse, ApiUnauthorizedResponse } from '@nestjs/swagger'
import { JwtGuard } from 'src/core/guards/jwt.guard'
import { PERMISSION_KEY, PermissionGuard } from 'src/core/guards/permission.guard'

export function Auth(permission?: string) {
  return applyDecorators(
    SetMetadata(PERMISSION_KEY, permission),
    UseGuards(JwtGuard, PermissionGuard),
    ApiBearerAuth(),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
    ApiForbiddenResponse({ description: 'Forbidden' })
  )
}
