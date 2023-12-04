import { ApiProperty } from '@nestjs/swagger'
import { ObjectId } from 'mongodb'
import { Base } from 'src/db/interfaces/base.interface'

export class BaseDto implements Base {
  @ApiProperty({
    type: String,
  })
  _id: ObjectId
}
