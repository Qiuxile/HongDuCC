import { Controller, Get, Post, Put, Delete, Param, Body, Query, UseGuards } from '@nestjs/common'
import { ResourcesService } from './resources.service.js'
import { CreateResourceDto, UpdateResourceDto } from './dto/resource.dto.js'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js'
import { OptionalAuthGuard } from '../auth/guards/optional-auth.guard.js'
import { CurrentUser } from '../common/decorators/current-user.decorator.js'
import { Public } from '../common/decorators/public.decorator.js'

@Controller('api/resources')
export class ResourcesController {
  constructor(private resourcesService: ResourcesService) {}

  @Public()
  @UseGuards(OptionalAuthGuard)
  @Get()
  list(
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number,
    @Query('category') category?: string,
    @Query('subject') subject?: string,
    @Query('grade') grade?: string,
    @Query('search') search?: string,
    @Query('uploaderId') uploaderId?: number,
    @Query('sort') sort?: string,
    @CurrentUser() user?: any,
  ) {
    return this.resourcesService.list({ page, pageSize, category, subject, grade, search, uploaderId, sort, currentUserId: user?.id })
  }

  @Public()
  @UseGuards(OptionalAuthGuard)
  @Get(':id')
  getById(@Param('id') id: string, @CurrentUser() user?: any) {
    return this.resourcesService.getById(parseInt(id), user?.id)
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateResourceDto, @CurrentUser('id') userId: number) {
    return this.resourcesService.create(dto, userId)
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateResourceDto,
    @CurrentUser() user: any,
  ) {
    return this.resourcesService.update(parseInt(id), dto, user.id, user.role)
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  delete(@Param('id') id: string, @CurrentUser() user: any) {
    return this.resourcesService.delete(parseInt(id), user.id, user.role)
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/like')
  like(@Param('id') id: string, @CurrentUser('id') userId: number) {
    return this.resourcesService.like(parseInt(id), userId)
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id/like')
  unlike(@Param('id') id: string, @CurrentUser('id') userId: number) {
    return this.resourcesService.unlike(parseInt(id), userId)
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/download')
  download(@Param('id') id: string) {
    return this.resourcesService.recordDownload(parseInt(id))
  }
}
