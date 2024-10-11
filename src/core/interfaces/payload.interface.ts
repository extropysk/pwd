import { Actions } from 'src/core/enums/actions.enum'

export interface Payload {
  sub: string
  permissions: Record<string, Actions>
}
