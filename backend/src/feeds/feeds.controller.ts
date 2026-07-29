import { Controller, Get, Post, Delete, Param, Body, Query, UseGuards } from '@nestjs/common'
import { FeedsService } from './feeds.service.js'
import { CreateFeedDto } from './dto/feed.dto.js'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js'
import { OptionalAuthGuard } from '../auth/guards/optional-auth.guard.js'
import { CurrentUser } from '../common/decorators/current-user.decorator.js'
import { Public } from '../common/decorators/public.decorator.js'

@Controller('api/feed')
export class FeedsController {
  constructor(private feedsService: FeedsService) {}

  @Public()
  @UseGuards(OptionalAuthGuard)
  @Get()
  list(@Query('page') page?: number, @Query('pageSize') pageSize?: number, @CurrentUser() user?: any) {
    return this.feedsService.list(page, pageSize, user?.id)
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateFeedDto, @CurrentUser('id') userId: number) {
    return this.feedsService.create(dto, userId)
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  delete(@Param('id') id: string, @CurrentUser() user: any) {
    return this.feedsService.delete(parseInt(id), user.id, user.role)
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/like')
  like(@Param('id') id: string, @CurrentUser('id') userId: number) {
    return this.feedsService.like(parseInt(id), userId)
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id/like')
  unlike(@Param('id') id: string, @CurrentUser('id') userId: number) {
    return this.feedsService.unlike(parseInt(id), userId)
  }
}
