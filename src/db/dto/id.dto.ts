import { ApiProperty } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { ObjectId } from 'mongodb'
import { IsObjectId } from 'src/db/decorators/is-object-id.decorator'

const toObjectId = (value: string) => {
  return ObjectId.isValid(value) ? new ObjectId(value) : null
}

export class IdDto {
  @ApiProperty({
    type: String,
  })
  @IsObjectId()
  @Transform(({ value }) => toObjectId(value))
  id: ObjectId
}
