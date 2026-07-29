import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service.js'

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async dashboard() {
    const [userCount, newsCount, resourceCount, postCount, feedCount, clubCount, pendingReports] =
      await Promise.all([
        this.prisma.user.count(),
        this.prisma.news.count({ where: { status: 'published' } }),
        this.prisma.resource.count({ where: { status: 'published' } }),
        this.prisma.forumPost.count({ where: { status: 'published' } }),
        this.prisma.feed.count({ where: { status: 'published' } }),
        this.prisma.club.count({ where: { status: 'active' } }),
        this.prisma.report.count({ where: { status: 'pending' } }),
      ])
    return { userCount, newsCount, resourceCount, postCount, feedCount, clubCount, pendingReports }
  }

  async listUsers(page = 1, pageSize = 20, search?: string) {
    const where: any = {}
    if (search) {
      where.OR = [
        { nickname: { contains: search } },
        { studentId: { contains: search } },
      ]
    }
    const [items, total] = await Promise.all([
      this.prisma.user.findMany({
        where, orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize, take: pageSize,
        select: { id: true, studentId: true, nickname: true, role: true, status: true, credits: true, createdAt: true },
      }),
      this.prisma.user.count({ where }),
    ])
    return { list: items, total, page, pageSize, totalPages: Math.max(1, Math.ceil(total / pageSize)) }
  }

  async updateUserStatus(userId: number, status: string) {
    return this.prisma.user.update({ where: { id: userId }, data: { status } })
  }
}
