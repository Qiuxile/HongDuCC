import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service.js'
import { CreatePostDto, UpdatePostDto } from './dto/forum.dto.js'

@Injectable()
export class ForumService {
  constructor(private prisma: PrismaService) {}

  async list(page = 1, pageSize = 15, category?: string, topic?: string) {
    const where: any = { status: 'published' }
    if (category) where.category = category
    if (topic) where.topicName = topic

    const [items, total] = await Promise.all([
      this.prisma.forumPost.findMany({
        where,
        orderBy: [{ isPinned: 'desc' }, { createdAt: 'desc' }],
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: { author: { select: { id: true, nickname: true, avatarUrl: true, role: true } } },
      }),
      this.prisma.forumPost.count({ where }),
    ])
    return { list: items, total, page, pageSize, totalPages: Math.max(1, Math.ceil(total / pageSize)) }
  }

  async getById(id: number, currentUserId?: number) {
    const post = await this.prisma.forumPost.findFirst({
      where: { id, status: 'published' },
      include: { author: { select: { id: true, nickname: true, avatarUrl: true, role: true } } },
    })
    if (!post) throw new NotFoundException('帖子不存在')
    await this.prisma.forumPost.update({ where: { id }, data: { viewCount: { increment: 1 } } })

    let isLiked = false
    if (currentUserId) {
      const like = await this.prisma.forumLike.findUnique({
        where: { postId_userId: { postId: id, userId: currentUserId } },
      })
      isLiked = !!like
    }
    return { ...post, isLiked }
  }

  async create(dto: CreatePostDto, authorId: number) {
    return this.prisma.forumPost.create({ data: { ...dto, authorId } })
  }

  async update(id: number, dto: UpdatePostDto, userId: number, userRole: string) {
    const post = await this.prisma.forumPost.findUnique({ where: { id } })
    if (!post) throw new NotFoundException('帖子不存在')
    if (post.authorId !== userId && userRole !== 'admin') throw new ForbiddenException('无权限')
    return this.prisma.forumPost.update({ where: { id }, data: dto })
  }

  async softDelete(id: number, userId: number, userRole: string) {
    const post = await this.prisma.forumPost.findUnique({ where: { id } })
    if (!post) throw new NotFoundException('帖子不存在')
    if (post.authorId !== userId && userRole !== 'admin') throw new ForbiddenException('无权限')
    await this.prisma.forumPost.update({ where: { id }, data: { status: 'deleted' } })
  }

  async like(id: number, userId: number) {
    const post = await this.prisma.forumPost.findFirst({ where: { id, status: 'published' } })
    if (!post) throw new NotFoundException('帖子不存在')
    const existing = await this.prisma.forumLike.findUnique({
      where: { postId_userId: { postId: id, userId } },
    })
    if (!existing) {
      await this.prisma.forumLike.create({ data: { postId: id, userId } })
      await this.prisma.forumPost.update({ where: { id }, data: { likeCount: { increment: 1 } } })
    }
    return { likeCount: post.likeCount + (existing ? 0 : 1), isLiked: true }
  }

  async unlike(id: number, userId: number) {
    const post = await this.prisma.forumPost.findFirst({ where: { id, status: 'published' } })
    if (!post) throw new NotFoundException('帖子不存在')
    const existing = await this.prisma.forumLike.findUnique({
      where: { postId_userId: { postId: id, userId } },
    })
    if (existing) {
      await this.prisma.forumLike.delete({ where: { id: existing.id } })
      await this.prisma.forumPost.update({ where: { id }, data: { likeCount: { increment: -1 } } })
      return { likeCount: post.likeCount - 1, isLiked: false }
    }
    return { likeCount: post.likeCount, isLiked: false }
  }
}
