import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { Permission } from 'src/core/enums/permission.enum'

export const PERMISSION_KEY = 'permission'

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest()

    const { permission, module } = this.reflector.getAllAndOverride<{
      module: string
      permission: Permission
    }>(PERMISSION_KEY, [context.getHandler(), context.getClass()])

    if (!module) {
      return true
    }

    return (request['user'].permissions?.[module] & permission) > 0
  }
}
