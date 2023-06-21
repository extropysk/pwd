import { Controller, Get, UseGuards } from "@nestjs/common";
import { ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { Current } from "src/auth/decorators/current.decorator";
import { JwtGuard } from "src/auth/guards/jwt.guard";
import { UserDto } from "src/users/dto/user.dto";

@ApiTags("users")
@Controller("users")
@UseGuards(JwtGuard)
export class UsersController {
  @ApiOkResponse({ type: UserDto })
  @Get("profile")
  getProfile(@Current() current) {
    return current;
  }
}
