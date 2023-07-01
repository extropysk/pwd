import { User } from 'src/users/interfaces/user.interface'

export class UserDto implements User {
  key: string
  roles: string[]
}
