import { Controller, Get, UseGuards } from "@nestjs/common";
import { ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { Current } from "src/auth/decorators/current.decorator";
import { JwtGuard } from "src/auth/guards/jwt.guard";
import { Payload } from "src/auth/interfaces/payload.interface";
import { UserDto } from "src/users/dto/user.dto";
import { UsersService } from "src/users/users.service";

@ApiTags("users")
@Controller("users")
@UseGuards(JwtGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @ApiOkResponse({ type: UserDto })
  @Get("current")
  getProfile(@Current() current: Payload) {
    return this.usersService.getCurrentUser(current);
  }
}
