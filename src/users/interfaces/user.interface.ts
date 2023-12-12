import { Permission } from 'src/core/enums/permission.enum'
import { Base } from 'src/db/interfaces/base.interface'

export interface User extends Base {
  email: string
  key?: string
  permissions: Record<string, Permission>
  password?: string
}
