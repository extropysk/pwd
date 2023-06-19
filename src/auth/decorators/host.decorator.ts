import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const Host = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return `${request.protocol}://${request.get("Host")}`;
  }
);
