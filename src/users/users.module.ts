import { Module } from "@nestjs/common";
import { UsersController } from "src/users/users.controller";

@Module({
  controllers: [UsersController],
})
export class UsersModule {}
