import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common'
import { Request } from 'express'
import { ObjectId } from 'mongodb'
import { AuthService } from 'src/auth/auth.service'

export const SESSION_COOKIE_NAME = 'session'
export const SESSION_PREFIX = 'session'

@Injectable()
export class SessionGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()
    const sesionId = this.extractSessionFromCookie(request)
    if (!sesionId) {
      throw new UnauthorizedException()
    }

    const session = await this.authService.findOne({ _id: new ObjectId(sesionId) })
    if (!session?.payload) {
      throw new UnauthorizedException()
    }

    // 💡 We're assigning the payload to the request object here
    // so that we can access it in our route handlers
    request['user'] = session.payload
    return true
  }

  private extractSessionFromCookie(request: Request): string | undefined {
    return request.cookies?.[SESSION_COOKIE_NAME]
  }
}
