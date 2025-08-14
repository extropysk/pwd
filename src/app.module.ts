import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { EventEmitterModule } from '@nestjs/event-emitter'
import { UsersModule } from 'src/users/users.module'
import { AuthModule } from './auth/auth.module'
import { StorageModule } from 'src/storage/storage.module'
import configuration from 'src/configuration'

@Module({
  imports: [
    StorageModule,
    AuthModule,
    UsersModule,
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    EventEmitterModule.forRoot(),
  ],
})
export class AppModule {}
