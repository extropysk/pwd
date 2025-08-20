import { Controller, Get } from '@nestjs/common'
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'
import { Auth, Current, PayloadDto, Payload } from '@extropysk/nest-core'
import { UsersService } from 'src/users/users.service'

@ApiTags('users')
@Controller('users')
@Auth()
export class UsersController {
  constructor(private usersService: UsersService) {}

  @ApiOperation({ summary: 'Get current user' })
  @ApiOkResponse({ type: PayloadDto })
  @Get('me')
  getCurrentUser(@Current() current: Payload) {
    return this.usersService.getCurrentUser(current)
  }
}
