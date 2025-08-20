import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common'
import { Request } from 'express'
import { Payload } from '@extropysk/nest-core'
import { StorageService } from 'src/storage/storage.service'

export const SESSION_COOKIE_NAME = 'session'
export const SESSION_PREFIX = 'session'

@Injectable()
export class SessionGuard implements CanActivate {
  constructor(private storageService: StorageService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()
    const session = this.extractSessionFromCookie(request)
    if (!session) {
      throw new UnauthorizedException()
    }

    const payload = await this.storageService.get<Payload>(`${SESSION_PREFIX}/${session}`)
    if (!payload?.sub) {
      throw new UnauthorizedException()
    }

    // 💡 We're assigning the payload to the request object here
    // so that we can access it in our route handlers
    request['user'] = payload
    return true
  }

  private extractSessionFromCookie(request: Request): string | undefined {
    return request.cookies?.[SESSION_COOKIE_NAME]
  }
}
