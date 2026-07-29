import { Injectable, NotFoundException, ConflictException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service.js'

@Injectable()
export class SocialService {
  constructor(private prisma: PrismaService) {}

  async follow(followerId: number, followedId: number) {
    if (followerId === followedId) throw new ConflictException('不能关注自己')
    const target = await this.prisma.user.findUnique({ where: { id: followedId } })
    if (!target) throw new NotFoundException('用户不存在')

    const existing = await this.prisma.follow.findUnique({
      where: { followerId_followedId: { followerId, followedId } },
    })
    if (!existing) {
      await this.prisma.follow.create({ data: { followerId, followedId } })
    }
    return { isFollowing: true }
  }

  async unfollow(followerId: number, followedId: number) {
    const existing = await this.prisma.follow.findUnique({
      where: { followerId_followedId: { followerId, followedId } },
    })
    if (existing) {
      await this.prisma.follow.delete({ where: { id: existing.id } })
    }
    return { isFollowing: false }
  }

  async getFollowers(userId: number, page = 1, pageSize = 20) {
    const [items, total] = await Promise.all([
      this.prisma.follow.findMany({
        where: { followedId: userId },
        skip: (page - 1) * pageSize, take: pageSize,
        include: { follower: { select: { id: true, nickname: true, avatarUrl: true, studentId: true } } },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.follow.count({ where: { followedId: userId } }),
    ])
    return { list: items.map(f => f.follower), total, page, pageSize, totalPages: Math.max(1, Math.ceil(total / pageSize)) }
  }

  async getFollowing(userId: number, page = 1, pageSize = 20) {
    const [items, total] = await Promise.all([
      this.prisma.follow.findMany({
        where: { followerId: userId },
        skip: (page - 1) * pageSize, take: pageSize,
        include: { followed: { select: { id: true, nickname: true, avatarUrl: true, studentId: true } } },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.follow.count({ where: { followerId: userId } }),
    ])
    return { list: items.map(f => f.followed), total, page, pageSize, totalPages: Math.max(1, Math.ceil(total / pageSize)) }
  }
}
