import { Payload } from 'src/core/interfaces/payload.interface'

export interface Token extends Payload {
  access_token: string
}
