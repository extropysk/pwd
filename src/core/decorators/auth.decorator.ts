import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiForbiddenResponse, ApiUnauthorizedResponse } from '@nestjs/swagger'
import { Permission } from 'src/core/enums/permission.enum'
import { JwtGuard } from 'src/core/guards/jwt.guard'
import { PERMISSION_KEY, PermissionGuard } from 'src/core/guards/permission.guard'

export function Auth(module?: string, permission = Permission.READ) {
  return applyDecorators(
    SetMetadata(PERMISSION_KEY, { module, permission }),
    UseGuards(JwtGuard, PermissionGuard),
    ApiBearerAuth(),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
    ApiForbiddenResponse({ description: 'Forbidden' })
  )
}
