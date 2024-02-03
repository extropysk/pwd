import { ObjectId } from 'mongodb'
import { IsObjectId, ToObjectId } from 'src/db/decorators/is-object-id.decorator'

export class IdDto {
  @IsObjectId()
  @ToObjectId()
  id: ObjectId
}
