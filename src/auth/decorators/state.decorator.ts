import { createParamDecorator, ExecutionContext } from '@nestjs/common'

export interface AuthState {
  callback?: string
}

export const State = createParamDecorator((data: string, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest()

  const state = JSON.parse(request.query.state ?? {}) as AuthState
  return state
})
