export interface Payload {
  sub: string
  email: string
  roles: string[]
}

export class PayloadDto implements Payload {
  sub: string
  email: string
  roles: string[]
}
