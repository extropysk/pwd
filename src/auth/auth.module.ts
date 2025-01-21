import { Module } from '@nestjs/common'
import { GoogleStrategy } from 'src/auth/passport/google.strategy'

import { UsersModule } from 'src/users/users.module'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { StorageModule } from 'src/storage/storage.module'

@Module({
  imports: [StorageModule, UsersModule],
  providers: [AuthService, GoogleStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
