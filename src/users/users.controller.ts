import { Controller, Get, UseGuards } from "@nestjs/common";
import { ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { Current } from "src/auth/decorators/current.decorator";
import { PayloadDto } from "src/auth/dto/payload.dto";
import { JwtGuard } from "src/auth/guards/jwt.guard";

@ApiTags("users")
@Controller("users")
@UseGuards(JwtGuard)
export class UsersController {
  @ApiOkResponse({ type: PayloadDto })
  @Get("profile")
  getProfile(@Current() current) {
    return current;
  }
}
