import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { Payload } from 'src/core/dto/payload.dto'

export const Current = createParamDecorator((data: unknown, context: ExecutionContext) => {
  const { user }: { user: Payload } = context.switchToHttp().getRequest()
  return user
})
