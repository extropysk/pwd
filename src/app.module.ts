import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { EventEmitterModule } from '@nestjs/event-emitter'
import { UsersModule } from 'src/users/users.module'
import { AuthModule } from './auth/auth.module'
import { StorageModule } from 'src/storage/storage.module'
import configuration, { JwtConfig } from 'src/configuration'
import { CoreModule } from '@extropysk/nest-core'
import { APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core'
import { ZodSerializerInterceptor, ZodValidationPipe } from 'nestjs-zod'

@Module({
  imports: [
    CoreModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const jwt = configService.get<JwtConfig>('jwt') as JwtConfig
        return {
          jwt,
        }
      },
    }),
    StorageModule,
    AuthModule,
    UsersModule,
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    EventEmitterModule.forRoot(),
  ],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ZodValidationPipe,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ZodSerializerInterceptor,
    },
  ],
})
export class AppModule {}
