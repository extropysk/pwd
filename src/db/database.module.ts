import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Db, MongoClient } from 'mongodb'

export const DATABASE = 'database'

@Module({
  providers: [
    {
      provide: DATABASE,
      useFactory: async (configService: ConfigService): Promise<Db> => {
        try {
          const client = await MongoClient.connect(configService.get<string>('CONNECTION_STRING'))
          return client.db(configService.get<string>('DATABASE'))
        } catch (e) {
          throw e
        }
      },
      inject: [ConfigService],
    },
  ],
  exports: [DATABASE],
})
export class DatabaseModule {}
