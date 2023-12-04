import { ApiProperty } from '@nestjs/swagger'
import { ObjectId, UpdateResult } from 'mongodb'

export class UpdateResultDto implements UpdateResult {
  acknowledged: boolean
  matchedCount: number
  modifiedCount: number
  upsertedCount: number

  @ApiProperty({
    type: String,
  })
  upsertedId: ObjectId
}
