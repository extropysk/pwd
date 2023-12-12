import { Module } from '@nestjs/common'
import { DatabaseModule } from 'src/db/database.module'
import { UsersController } from 'src/users/users.controller'
import { UsersService } from 'src/users/users.service'

@Module({
  providers: [UsersService],
  controllers: [UsersController],
  imports: [DatabaseModule],
  exports: [UsersService],
})
export class UsersModule {}
