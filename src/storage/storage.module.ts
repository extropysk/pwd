import { Module } from "@nestjs/common";
import { RedisModule } from "src/storage/redis.module";
import { StorageService } from "src/storage/storage.service";

@Module({
  imports: [RedisModule],
  providers: [StorageService],
  exports: [StorageService],
})
export class StorageModule {}
