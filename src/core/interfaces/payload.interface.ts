import { Actions } from 'src/core/enums/actions.enum'

export interface Permission {
  subject: string
  action: Actions
}

export interface Payload {
  sub: string
  permissions: Permission[]
}
