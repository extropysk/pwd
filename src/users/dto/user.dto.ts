import { Permission } from 'src/core/enums/permission.enum'
import { BaseDto } from 'src/db/dto/base.dto'
import { User, UserProvider } from 'src/users/interfaces/user.interface'

class UserProviderDto implements UserProvider {
  id: string
}

export class UserDto extends BaseDto implements User {
  ln?: UserProviderDto
  password?: string
  email: string
  key?: string
  permissions: Record<string, Permission>
}
