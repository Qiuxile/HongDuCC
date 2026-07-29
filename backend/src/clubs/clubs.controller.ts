import { Controller, Get, Post, Put, Delete, Param, Body, Query, UseGuards } from '@nestjs/common'
import { ClubsService } from './clubs.service.js'
import { CreateClubDto, UpdateClubDto, CreateEventDto } from './dto/club.dto.js'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js'
import { CurrentUser } from '../common/decorators/current-user.decorator.js'
import { Public } from '../common/decorators/public.decorator.js'

@Controller('api/clubs')
export class ClubsController {
  constructor(private clubsService: ClubsService) {}

  @Public()
  @Get()
  list(@Query('page') page?: number, @Query('pageSize') pageSize?: number, @Query('category') category?: string) {
    return this.clubsService.list(page, pageSize, category)
  }

  @Public()
  @Get(':id')
  getById(@Param('id') id: string) {
    return this.clubsService.getById(parseInt(id))
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateClubDto, @CurrentUser('id') userId: number) {
    return this.clubsService.create(dto, userId)
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateClubDto, @CurrentUser() user: any) {
    return this.clubsService.update(parseInt(id), dto, user.id, user.role)
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  delete(@Param('id') id: string, @CurrentUser() user: any) {
    return this.clubsService.softDelete(parseInt(id), user.id, user.role)
  }

  // Members
  @Public()
  @Get(':id/members')
  listMembers(@Param('id') id: string) {
    return this.clubsService.listMembers(parseInt(id))
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/join')
  join(@Param('id') id: string, @CurrentUser('id') userId: number) {
    return this.clubsService.join(parseInt(id), userId)
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id/leave')
  leave(@Param('id') id: string, @CurrentUser('id') userId: number) {
    return this.clubsService.leave(parseInt(id), userId)
  }

  // Events
  @Public()
  @Get(':id/events')
  listEvents(@Param('id') id: string) {
    return this.clubsService.listEvents(parseInt(id))
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/events')
  createEvent(@Param('id') id: string, @Body() dto: CreateEventDto, @CurrentUser('id') userId: number) {
    return this.clubsService.createEvent(parseInt(id), dto, userId)
  }
}
