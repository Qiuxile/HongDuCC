import { Controller, Get, Post, Put, Delete, Param, Body, Query, UseGuards } from '@nestjs/common'
import { NewsService } from './news.service.js'
import { CreateNewsDto, UpdateNewsDto } from './dto/news.dto.js'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js'
import { AdminGuard } from '../auth/guards/admin.guard.js'
import { CurrentUser } from '../common/decorators/current-user.decorator.js'
import { Public } from '../common/decorators/public.decorator.js'

@Controller('api/news')
export class NewsController {
  constructor(private newsService: NewsService) {}

  @Public()
  @Get()
  list(
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number,
    @Query('category') category?: string,
  ) {
    return this.newsService.list(page, pageSize, category)
  }

  @Public()
  @Get(':id')
  getById(@Param('id') id: string) {
    return this.newsService.getById(parseInt(id))
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Post()
  create(@Body() dto: CreateNewsDto, @CurrentUser('id') authorId: number) {
    return this.newsService.create(dto, authorId)
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateNewsDto) {
    return this.newsService.update(parseInt(id), dto)
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.newsService.softDelete(parseInt(id))
  }
}
