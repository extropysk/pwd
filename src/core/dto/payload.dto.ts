import { Actions } from 'src/core/enums/actions.enum'
import { Payload } from 'src/core/interfaces/payload.interface'

export class PayloadDto implements Payload {
  permissions: Record<string, Actions>
  sub: string
}
