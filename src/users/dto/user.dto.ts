import { Permission } from 'src/core/enums/permission.enum'
import { BaseDto } from 'src/db/dto/base.dto'
import { User } from 'src/users/interfaces/user.interface'

export class UserDto extends BaseDto implements User {
  email: string
  key?: string
  permissions: Record<string, Permission>
}
