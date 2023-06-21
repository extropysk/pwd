import { Module } from "@nestjs/common";
import { UsersController } from "src/users/users.controller";
import { UsersService } from "src/users/users.service";

@Module({
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
