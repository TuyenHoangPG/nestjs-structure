import { UserRole } from '@constants/enum';
import { Roles } from '@decorators/roles.decorator';
import { JWTAuthGuard } from '@guards/jwt-auth.guard';
import { RolesGuard } from '@guards/roles.guard';
import { Body, Controller, Get, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ViewListUserRequest } from './dtos/requests/view-list-user.request.dto';
import { UserResponseDto } from './dtos/responses/user.response.dto';

import { UserService } from './user.service';

@Controller('users')
@ApiTags('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/')
  @Roles(UserRole.ADMIN)
  @UseGuards(JWTAuthGuard, RolesGuard)
  @ApiResponse({ status: 200, type: UserResponseDto })
  @ApiOperation({ summary: 'Get list users' })
  async getListUsers(@Body() body: ViewListUserRequest) {
    const result = await this.userService.getList(body);
    return result;
  }
}
