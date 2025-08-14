import { PayloadDto } from 'src/core/dto/payload.dto'
import { Payload } from 'src/core/dto/payload.dto'

export class UsersService {
  getCurrentUser(current: Payload): PayloadDto {
    return current
  }
}
