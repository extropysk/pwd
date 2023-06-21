import { Status } from "src/auth/enums/status.enums";

export class CallbackDto {
  status: Status;
  message?: string;

  constructor(status: Status) {
    this.status = status;
  }
}
