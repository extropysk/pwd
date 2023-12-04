import { Payload } from 'src/core/interfaces/payload.interface'
import { Base } from 'src/db/interfaces/base.interface'

export interface Session extends Base {
  k1: string
  expired: Date
  payload?: Payload
}
