import { Controller, Post, Get, Put, Body, UseGuards, HttpCode } from '@nestjs/common'
import { AuthService } from './auth.service.js'
import { RegisterDto } from './dto/register.dto.js'
import { LoginDto } from './dto/login.dto.js'
import { ChangePasswordDto } from './dto/change-password.dto.js'
import { JwtAuthGuard } from './guards/jwt-auth.guard.js'
import { CurrentUser } from '../common/decorators/current-user.decorator.js'
import { Public } from '../common/decorators/public.decorator.js'

@Controller('api/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('register')
  @HttpCode(201)
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto)
  }

  @Public()
  @Post('login')
  @HttpCode(200)
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto)
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getMe(@CurrentUser('id') userId: number) {
    return this.authService.getMe(userId)
  }

  @UseGuards(JwtAuthGuard)
  @Put('change-password')
  changePassword(
    @CurrentUser('id') userId: number,
    @Body() dto: ChangePasswordDto,
  ) {
    return this.authService.changePassword(userId, dto)
  }
}
