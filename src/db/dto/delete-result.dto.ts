import { DeleteResult } from 'mongodb'

export class DeleteResultDto implements DeleteResult {
  acknowledged: boolean
  deletedCount: number
}
