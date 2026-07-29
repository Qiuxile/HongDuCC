import { Controller, Get, Put, Param, Query, UseGuards } from '@nestjs/common'
import { NotificationsService } from './notifications.service.js'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js'
import { CurrentUser } from '../common/decorators/current-user.decorator.js'

@Controller('api/notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private notificationsService: NotificationsService) {}

  @Get()
  list(@CurrentUser('id') userId: number,
       @Query('page') page?: number, @Query('pageSize') pageSize?: number) {
    return this.notificationsService.list(userId, page, pageSize)
  }

  @Get('unread-count')
  unreadCount(@CurrentUser('id') userId: number) {
    return this.notificationsService.unreadCount(userId)
  }

  @Put(':id/read')
  markRead(@Param('id') id: string, @CurrentUser('id') userId: number) {
    return this.notificationsService.markRead(parseInt(id), userId)
  }

  @Put('read-all')
  markAllRead(@CurrentUser('id') userId: number) {
    return this.notificationsService.markAllRead(userId)
  }
}
