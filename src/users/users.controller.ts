import { Controller, Get } from "@nestjs/common";
import { ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { Current } from "src/auth/decorators/current.decorator";
import { PayloadDto } from "src/auth/dto/payload.dto";

@ApiTags("users")
@Controller("users")
export class UsersController {
  @ApiOkResponse({ type: PayloadDto })
  @Get("profile")
  getProfile(@Current() current) {
    return current;
  }
}
