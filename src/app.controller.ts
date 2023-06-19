import { Controller, MessageEvent, Param, Sse } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { Observable, fromEvent, map } from "rxjs";
import { Public } from "src/auth/decorators/public.decorator";
import { UserDto } from "src/auth/dto/user.dto";

@Controller()
export class AppController {
  constructor(private eventEmitter: EventEmitter2) {}

  @Public()
  @Sse("sse/:id")
  sse(@Param("id") id: string): Observable<MessageEvent> {
    return fromEvent(this.eventEmitter, id).pipe(
      map((data: UserDto) => ({ data }))
    );
  }
}
