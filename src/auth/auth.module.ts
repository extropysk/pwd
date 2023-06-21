import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { StorageModule } from "src/storage/storage.module";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";

@Module({
  imports: [StorageModule, JwtModule.register({ global: true })],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
