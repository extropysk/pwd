import { Permission } from 'src/core/interfaces/payload.interface'
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
  permissions?: Permission[]
  password?: string
}
