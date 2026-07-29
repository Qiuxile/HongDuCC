import { Controller, Get, Post, Put, Delete, Param, Body, Query, UseGuards } from '@nestjs/common'
import { ForumService } from './forum.service.js'
import { CreatePostDto, UpdatePostDto } from './dto/forum.dto.js'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js'
import { OptionalAuthGuard } from '../auth/guards/optional-auth.guard.js'
import { CurrentUser } from '../common/decorators/current-user.decorator.js'
import { Public } from '../common/decorators/public.decorator.js'

@Controller('api/forum')
export class ForumController {
  constructor(private forumService: ForumService) {}

  @Public()
  @Get()
  list(@Query('page') page?: number, @Query('pageSize') pageSize?: number,
       @Query('category') category?: string, @Query('topic') topic?: string) {
    return this.forumService.list(page, pageSize, category, topic)
  }

  @Public()
  @UseGuards(OptionalAuthGuard)
  @Get(':id')
  getById(@Param('id') id: string, @CurrentUser() user?: any) {
    return this.forumService.getById(parseInt(id), user?.id)
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreatePostDto, @CurrentUser('id') userId: number) {
    return this.forumService.create(dto, userId)
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdatePostDto, @CurrentUser() user: any) {
    return this.forumService.update(parseInt(id), dto, user.id, user.role)
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  delete(@Param('id') id: string, @CurrentUser() user: any) {
    return this.forumService.softDelete(parseInt(id), user.id, user.role)
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/like')
  like(@Param('id') id: string, @CurrentUser('id') userId: number) {
    return this.forumService.like(parseInt(id), userId)
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id/like')
  unlike(@Param('id') id: string, @CurrentUser('id') userId: number) {
    return this.forumService.unlike(parseInt(id), userId)
  }
}
