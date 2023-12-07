import { Payload } from 'src/core/interfaces/payload.interface'
import { Base } from 'src/db/interfaces/base.interface'

export interface Session extends Base {
  expired: Date
  k1?: string
  payload?: Payload
}
