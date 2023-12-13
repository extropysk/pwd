import { Permission } from 'src/core/enums/permission.enum'
import { Base } from 'src/db/interfaces/base.interface'

export interface UserProvider {
  id: string
}

export interface User extends Base {
  email: string
  ln?: UserProvider
  permissions: Record<string, Permission>
  password?: string
}
