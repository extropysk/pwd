import { Body, Controller, Get, NotFoundException, Param, Put } from '@nestjs/common'
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'
import { Auth } from 'src/core/decorators/auth.decorator'
import { Current } from 'src/core/decorators/current.decorator'
import { Actions } from 'src/core/enums/actions.enum'
import { Payload } from 'src/core/interfaces/payload.interface'
import { IdDto } from 'src/db/dto/id.dto'
import { UpdateResultDto } from 'src/db/dto/update-result.dto'
import { UpdatePermissionDto } from 'src/users/dto/update-permission.dto'
import { UserDto } from 'src/users/dto/user.dto'
import { UsersService } from 'src/users/users.service'

const MODULE = 'users'

@ApiTags(MODULE)
@Controller(MODULE)
@Auth()
export class UsersController {
  constructor(private usersService: UsersService) {}

  @ApiOperation({ summary: 'Get current user' })
  @ApiOkResponse({ type: UserDto })
  @Get('current')
  async getProfile(@Current() current: Payload) {
    return await this.usersService.getCurrentUser(current)
  }

  @ApiOperation({ summary: 'Get user' })
  @ApiOkResponse({ type: UserDto })
  @Get(':id')
  @Auth(MODULE, Actions.READ)
  async findOne(@Param() { id }: IdDto) {
    const user = await this.usersService.findOne({ _id: id }, { password: 0 })
    if (!user) {
      throw new NotFoundException()
    }
    return user
  }

  @ApiOkResponse({ type: UpdateResultDto })
  @Auth(MODULE, Actions.UPDATE)
  @Put(':id')
  async updatePermission(@Param() { id }: IdDto, @Body() permission: UpdatePermissionDto) {
    return await this.usersService.updatePermission(id, permission)
  }
}
