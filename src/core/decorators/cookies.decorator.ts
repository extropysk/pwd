import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { CookieOptions } from 'express'

export const COOKIE_OPTIONS: CookieOptions = { httpOnly: true, secure: true, sameSite: 'none' }

export const Cookies = createParamDecorator((data: string, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest()
  return data ? request.cookies?.[data] : request.cookies
})
