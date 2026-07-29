import { Controller, Get, Put, Param, Body, UseGuards } from '@nestjs/common'
import { UsersService } from './users.service.js'
import { UpdateUserDto } from './dto/update-user.dto.js'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js'
import { OptionalAuthGuard } from '../auth/guards/optional-auth.guard.js'
import { CurrentUser } from '../common/decorators/current-user.decorator.js'
import { Public } from '../common/decorators/public.decorator.js'

@Controller('api/users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getMyProfile(@CurrentUser('id') userId: number) {
    return this.usersService.getMyProfile(userId)
  }

  @UseGuards(JwtAuthGuard)
  @Put('profile')
  updateMyProfile(
    @CurrentUser('id') userId: number,
    @Body() dto: UpdateUserDto,
  ) {
    return this.usersService.updateMyProfile(userId, dto)
  }

  @Public()
  @UseGuards(OptionalAuthGuard)
  @Get('by-student-id/:studentId')
  getUserByStudentId(
    @Param('studentId') studentId: string,
    @CurrentUser() currentUser: any,
  ) {
    return this.usersService.getUserByStudentId(studentId, currentUser?.id)
  }

  @Public()
  @UseGuards(OptionalAuthGuard)
  @Get(':id')
  getUserById(
    @Param('id') id: string,
    @CurrentUser() currentUser: any,
  ) {
    return this.usersService.getUserById(parseInt(id), currentUser?.id)
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  updateUser(
    @Param('id') id: string,
    @Body() dto: UpdateUserDto,
    @CurrentUser() currentUser: any,
  ) {
    return this.usersService.updateUser(
      parseInt(id),
      dto,
      currentUser.id,
      currentUser.role,
    )
  }
}
