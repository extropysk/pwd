import { Token } from 'src/auth/interfaces/token.interface'

export class TokenDto implements Token {
  roles: string[]
  sub: string
  access_token: string
}
