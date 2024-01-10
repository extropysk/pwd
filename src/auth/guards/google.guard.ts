import { ExecutionContext, Injectable } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

@Injectable()
export class GoogleAuthGuard extends AuthGuard('google') {
  async getAuthenticateOptions(ctx: ExecutionContext) {
    const request = ctx.switchToHttp().getRequest()

    return {
      state: JSON.stringify(request.query),
    }
  }
}
