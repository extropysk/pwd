import { Controller, Get } from '@nestjs/common'
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'
import { Me, PayloadDto, Payload, Auth } from '@extropysk/nest-core'
import { UsersService } from 'src/users/users.service'

@ApiTags('users')
@Controller('users')
@Auth()
export class UsersController {
  constructor(private usersService: UsersService) {}

  @ApiOperation({ summary: 'Get current user' })
  @ApiOkResponse({ type: PayloadDto })
  @Get('me')
  getCurrentUser(@Me() current: Payload) {
    return this.usersService.getCurrentUser(current)
  }
}
