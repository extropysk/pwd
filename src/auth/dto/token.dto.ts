import { Token } from 'src/auth/interfaces/token.interface'
import { PayloadDto } from 'src/core/dto/payload.dto'

export class TokenDto extends PayloadDto implements Token {
  access_token: string
}
