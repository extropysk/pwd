import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { JwtGuard } from "src/auth/guards/jwt.guard";
import { UsersController } from "src/users/users.controller";

@Module({
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtGuard,
    },
  ],
  controllers: [UsersController],
})
export class UsersModule {}
