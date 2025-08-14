import { Payload, PayloadDto } from 'src/core/dto/payload.dto'

export interface Token extends Payload {
  access_token: string
}

export class TokenDto extends PayloadDto implements Token {
  access_token: string
}
