import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service.js'
import { CreateFeedDto } from './dto/feed.dto.js'

@Injectable()
export class FeedsService {
  constructor(private prisma: PrismaService) {}

  async list(page = 1, pageSize = 15, currentUserId?: number) {
    const where: any = { status: 'published' }
    const [items, total] = await Promise.all([
      this.prisma.feed.findMany({
        where, orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize, take: pageSize,
        include: { author: { select: { id: true, nickname: true, avatarUrl: true, role: true } } },
      }),
      this.prisma.feed.count({ where }),
    ])
    let likedIds = new Set<number>()
    if (currentUserId && items.length) {
      const likes = await this.prisma.feedLike.findMany({
        where: { feedId: { in: items.map(f => f.id) }, userId: currentUserId },
      })
      likedIds = new Set(likes.map(l => l.feedId))
    }
    return {
      list: items.map(f => ({ ...f, isLiked: likedIds.has(f.id) })),
      total, page, pageSize, totalPages: Math.max(1, Math.ceil(total / pageSize)),
    }
  }

  async create(dto: CreateFeedDto, authorId: number) {
    return this.prisma.feed.create({
      data: { content: dto.content, images: dto.images ?? [], authorId },
      include: { author: { select: { id: true, nickname: true, avatarUrl: true, role: true } } },
    })
  }

  async delete(id: number, userId: number, userRole: string) {
    const feed = await this.prisma.feed.findUnique({ where: { id } })
    if (!feed) throw new NotFoundException('动态不存在')
    if (feed.authorId !== userId && userRole !== 'admin') throw new NotFoundException('无权限')
    await this.prisma.feed.update({ where: { id }, data: { status: 'deleted' } })
  }

  async like(id: number, userId: number) {
    const existing = await this.prisma.feedLike.findUnique({
      where: { feedId_userId: { feedId: id, userId } },
    })
    if (!existing) {
      await this.prisma.feedLike.create({ data: { feedId: id, userId } })
      await this.prisma.feed.update({ where: { id }, data: { likeCount: { increment: 1 } } })
    }
    const feed = await this.prisma.feed.findUnique({ where: { id } })
    return { likeCount: feed?.likeCount ?? 0, isLiked: true }
  }

  async unlike(id: number, userId: number) {
    const existing = await this.prisma.feedLike.findUnique({
      where: { feedId_userId: { feedId: id, userId } },
    })
    if (existing) {
      await this.prisma.feedLike.delete({ where: { id: existing.id } })
      await this.prisma.feed.update({ where: { id }, data: { likeCount: { increment: -1 } } })
    }
    const feed = await this.prisma.feed.findUnique({ where: { id } })
    return { likeCount: feed?.likeCount ?? 0, isLiked: false }
  }
}
