import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { EventEmitterModule } from '@nestjs/event-emitter'
import { UsersModule } from 'src/users/users.module'
import { AuthModule } from './auth/auth.module'
import { StorageModule } from 'src/storage/storage.module'
import configuration from 'src/configuration'
import { CoreModule } from '@extropysk/nest-core'

@Module({
  imports: [
    CoreModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('jwt.secret') as string,
      }),
    }),
    StorageModule,
    AuthModule,
    UsersModule,
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    EventEmitterModule.forRoot(),
  ],
})
export class AppModule {}
