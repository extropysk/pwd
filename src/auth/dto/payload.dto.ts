import { Payload } from "src/auth/interfaces/payload.interface";

export class PayloadDto implements Payload {
  sub: string;
}
