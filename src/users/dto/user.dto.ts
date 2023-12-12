import { Permission } from 'src/core/enums/permission.enum'
import { User } from 'src/users/interfaces/user.interface'

export class UserDto implements User {
  key: string
  permissions: Record<string, Permission>
}
