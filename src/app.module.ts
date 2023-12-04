import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { EventEmitterModule } from '@nestjs/event-emitter'
import { JwtModule } from '@nestjs/jwt'
import { DatabaseModule } from 'src/db/database.module'
import { UsersModule } from 'src/users/users.module'
import { AuthModule } from './auth/auth.module'

@Module({
  imports: [
    DatabaseModule,
    AuthModule,
    UsersModule,
    ConfigModule.forRoot({ isGlobal: true }),
    JwtModule.register({ global: true }),
    EventEmitterModule.forRoot(),
  ],
})
export class AppModule {}
