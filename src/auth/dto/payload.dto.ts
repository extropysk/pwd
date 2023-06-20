import { Payload } from "src/auth/interfaces/payload.interface";

export class PayloadDto implements Payload {
  sub: string;

  constructor({ sub }: Payload) {
    this.sub = sub;
  }
}
