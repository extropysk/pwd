import { Inject, Injectable } from '@nestjs/common'
import Redis from 'ioredis'
import * as ms from 'ms'
import { REDIS } from 'src/storage/redis.module'

@Injectable()
export class StorageService {
  constructor(@Inject(REDIS) private readonly redis: Redis) {}

  set<T>(key: string, value: T, exp?: string): Promise<'OK'> {
    const obj = JSON.stringify(value)

    if (exp) {
      return this.redis.set(key, obj, 'PX', ms(exp))
    } else {
      return this.redis.set(key, obj)
    }
  }

  async get<T>(key: string): Promise<T> {
    const value = await this.redis.get(key)
    return value ? JSON.parse(value) : null
  }

  async del(key: string): Promise<number> {
    return await this.redis.del(key)
  }
}
