import { Module } from '@nestjs/common'
import { GoogleStrategy } from 'src/auth/passport/google.strategy'
import { DatabaseModule } from 'src/db/database.module'
import { UsersModule } from 'src/users/users.module'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'

@Module({
  imports: [DatabaseModule, UsersModule],
  providers: [AuthService, GoogleStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
