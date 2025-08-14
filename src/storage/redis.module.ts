import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import Redis from 'ioredis'
import { RedisConfig } from 'src/configuration'

export const REDIS = 'REDIS'

@Module({
  providers: [
    {
      provide: REDIS,
      useFactory: async (configService: ConfigService) => {
        const redisConfig = configService.get<RedisConfig>('redis') as RedisConfig
        return new Redis({
          host: redisConfig.host,
          port: redisConfig.port,
          password: redisConfig.password,
        })
      },
      inject: [ConfigService],
    },
  ],
  exports: [REDIS],
})
export class RedisModule {}
