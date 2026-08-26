import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service.js'
import { CreateCommentDto } from './dto/comment.dto.js'

@Injectable()
export class CommentsService {
  constructor(private prisma: PrismaService) {}

  /** Get comments for any target (resource, feed) */
  async listByTarget(targetType: string, targetId: number) {
    const comments = await this.prisma.comment.findMany({
      where: { targetType, targetId, parentId: null, deletedAt: null },
      include: {
        author: { select: { id: true, nickname: true, avatarUrl: true, role: true } },
        replies: {
          where: { deletedAt: null },
          include: { author: { select: { id: true, nickname: true, avatarUrl: true, role: true } } },
          orderBy: { createdAt: 'asc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    })
    return comments
  }

  async create(dto: CreateCommentDto, authorId: number) {
    const comment = await this.prisma.comment.create({
      data: {
        targetType: dto.targetType,
        targetId: dto.targetId,
        parentId: dto.parentId ?? null,
        content: dto.content,
        authorId,
      },
      include: { author: { select: { id: true, nickname: true, avatarUrl: true, role: true } } },
    })

    // Update comment count on the target
    if (dto.targetType === 'feed') {
      await this.prisma.feed.update({
        where: { id: dto.targetId },
        data: { commentCount: { increment: 1 } },
      })
    }

    return comment
  }

  async softDelete(commentId: number, userId: number, userRole: string) {
    const comment = await this.prisma.comment.findUnique({ where: { id: commentId } })
    if (!comment) throw new NotFoundException('评论不存在')
    if (comment.authorId !== userId && userRole !== 'admin') {
      // Allow delete by comment author or admin
      throw new NotFoundException('无权限')
    }
    await this.prisma.comment.update({ where: { id: commentId }, data: { deletedAt: new Date() } })
  }
}
