import { Controller, Get, Post, Delete, Param, Query, UseGuards } from '@nestjs/common'
import { SocialService } from './social.service.js'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js'
import { CurrentUser } from '../common/decorators/current-user.decorator.js'
import { Public } from '../common/decorators/public.decorator.js'

@Controller('api/social')
export class SocialController {
  constructor(private socialService: SocialService) {}

  @UseGuards(JwtAuthGuard)
  @Post('follow/:userId')
  follow(@Param('userId') userId: string, @CurrentUser('id') followerId: number) {
    return this.socialService.follow(followerId, parseInt(userId))
  }

  @UseGuards(JwtAuthGuard)
  @Delete('follow/:userId')
  unfollow(@Param('userId') userId: string, @CurrentUser('id') followerId: number) {
    return this.socialService.unfollow(followerId, parseInt(userId))
  }

  @Public()
  @Get('followers/:userId')
  getFollowers(@Param('userId') userId: string,
               @Query('page') page?: number, @Query('pageSize') pageSize?: number) {
    return this.socialService.getFollowers(parseInt(userId), page, pageSize)
  }

  @Public()
  @Get('following/:userId')
  getFollowing(@Param('userId') userId: string,
               @Query('page') page?: number, @Query('pageSize') pageSize?: number) {
    return this.socialService.getFollowing(parseInt(userId), page, pageSize)
  }
}
