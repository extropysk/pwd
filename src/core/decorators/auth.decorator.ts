import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiForbiddenResponse, ApiUnauthorizedResponse } from '@nestjs/swagger'
import { Actions } from 'src/core/enums/actions.enum'
import { JwtGuard } from 'src/core/guards/jwt.guard'
import { PERMISSION_KEY, PermissionGuard } from 'src/core/guards/permission.guard'

export function Auth(subject?: string, action = Actions.READ) {
  return applyDecorators(
    SetMetadata(PERMISSION_KEY, { subject, action }),
    UseGuards(JwtGuard, PermissionGuard),
    ApiBearerAuth(),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
    ApiForbiddenResponse({ description: 'Forbidden' })
  )
}
