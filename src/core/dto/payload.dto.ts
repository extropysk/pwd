import { Payload } from 'src/core/interfaces/payload.interface'

export class PayloadDto implements Payload {
  roles: string[]
  sub: string
}
