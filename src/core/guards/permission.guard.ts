import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { Actions } from 'src/core/enums/actions.enum'

export const PERMISSION_KEY = 'permission'

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest()

    const { subject, action } = this.reflector.getAllAndOverride<{
      subject: string
      action: Actions
    }>(PERMISSION_KEY, [context.getHandler(), context.getClass()])

    if (!subject) {
      return true
    }
    const permission = request['user'].permissions.find((p) => p.subject === subject)
    if (!permission) {
      return false
    }

    return (permission.action & action) > 0
  }
}
