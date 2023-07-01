import { Payload } from 'src/core/interfaces/payload.interface'
import { User } from 'src/users/interfaces/user.interface'

export class UsersService {
  getCurrentUser(current: Payload): User {
    return { key: current.sub, roles: current.roles }
  }
}
