import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service.js'

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {}

  async list(userId: number, page = 1, pageSize = 20) {
    const where = { userId }
    const [items, total] = await Promise.all([
      this.prisma.notification.findMany({
        where, orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize, take: pageSize,
      }),
      this.prisma.notification.count({ where }),
    ])
    return { list: items, total, page, pageSize, totalPages: Math.max(1, Math.ceil(total / pageSize)) }
  }

  async unreadCount(userId: number) {
    return { count: await this.prisma.notification.count({ where: { userId, isRead: false } }) }
  }

  async markRead(notificationId: number, userId: number) {
    await this.prisma.notification.updateMany({
      where: { id: notificationId, userId },
      data: { isRead: true },
    })
  }

  async markAllRead(userId: number) {
    await this.prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    })
  }
}
