import { Payload, PayloadDto } from '@extropysk/nest-core'

export class UsersService {
  getCurrentUser(current: Payload): PayloadDto {
    return current
  }
}
