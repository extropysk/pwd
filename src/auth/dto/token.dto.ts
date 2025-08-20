import { Payload, PayloadDto } from '@extropysk/nest-core'

export interface Token extends Payload {
  access_token: string
}

export class TokenDto extends PayloadDto implements Token {
  access_token: string
}
