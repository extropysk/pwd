import { Actions } from 'src/core/enums/actions.enum'
import { Base } from 'src/db/interfaces/base.interface'

export interface UserProvider {
  id: string
  name?: string
  photoUrl?: string
}

export interface User extends Base {
  email: string
  ln?: UserProvider
  google?: UserProvider
  permissions?: Record<string, Actions>
  password?: string
}
