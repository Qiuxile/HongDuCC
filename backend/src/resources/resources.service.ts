import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service.js'
import { CreateResourceDto, UpdateResourceDto } from './dto/resource.dto.js'

@Injectable()
export class ResourcesService {
  constructor(private prisma: PrismaService) {}

  async list(params: {
    page?: number; pageSize?: number; category?: string
    subject?: string; grade?: string; search?: string
    uploaderId?: number; sort?: string; currentUserId?: number
  }) {
    const { page = 1, pageSize = 12, category, subject, grade, search, uploaderId, sort, currentUserId } = params
    const where: any = { status: 'published' }
    if (category) where.category = category
    if (subject) where.subject = subject
    if (grade) where.grade = grade
    if (uploaderId) where.authorId = uploaderId
    if (search) {
      where.title = { contains: search }
    }

    const orderBy: any = sort === 'downloads' ? { downloadCount: 'desc' }
      : sort === 'likes' ? { likeCount: 'desc' }
      : { createdAt: 'desc' }

    const [items, total] = await Promise.all([
      this.prisma.resource.findMany({
        where, orderBy,
        skip: (page - 1) * pageSize, take: pageSize,
        include: { author: { select: { id: true, nickname: true, avatarUrl: true, role: true } } },
      }),
      this.prisma.resource.count({ where }),
    ])

    // Batch check liked status
    let likedIds = new Set<number>()
    if (currentUserId && items.length) {
      const likes = await this.prisma.resourceLike.findMany({
        where: { resourceId: { in: items.map(r => r.id) }, userId: currentUserId },
      })
      likedIds = new Set(likes.map(l => l.resourceId))
    }

    return {
      list: items.map(r => ({ ...r, isLiked: likedIds.has(r.id) })),
      total, page, pageSize,
      totalPages: Math.max(1, Math.ceil(total / pageSize)),
    }
  }

  async getById(id: number, currentUserId?: number) {
    const resource = await this.prisma.resource.findFirst({
      where: { id, status: 'published' },
      include: { author: { select: { id: true, nickname: true, avatarUrl: true, role: true } } },
    })
    if (!resource) throw new NotFoundException('资源不存在')

    let isLiked = false
    if (currentUserId) {
      const like = await this.prisma.resourceLike.findUnique({
        where: { resourceId_userId: { resourceId: id, userId: currentUserId } },
      })
      isLiked = !!like
    }
    return { ...resource, isLiked }
  }

  async create(dto: CreateResourceDto, authorId: number) {
    return this.prisma.resource.create({
      data: { ...dto, authorId },
    })
  }

  async update(id: number, dto: UpdateResourceDto, userId: number, userRole: string) {
    const resource = await this.prisma.resource.findUnique({ where: { id } })
    if (!resource) throw new NotFoundException('资源不存在')
    if (resource.authorId !== userId && userRole !== 'admin') {
      throw new ForbiddenException('无权限')
    }
    return this.prisma.resource.update({ where: { id }, data: dto })
  }

  async delete(id: number, userId: number, userRole: string) {
    const resource = await this.prisma.resource.findUnique({ where: { id } })
    if (!resource) throw new NotFoundException('资源不存在')
    if (resource.authorId !== userId && userRole !== 'admin') {
      throw new ForbiddenException('无权限')
    }
    // Hard delete — also clean up likes
    await this.prisma.resourceLike.deleteMany({ where: { resourceId: id } })
    await this.prisma.resource.delete({ where: { id } })
  }

  async like(id: number, userId: number) {
    const resource = await this.prisma.resource.findFirst({
      where: { id, status: 'published' },
    })
    if (!resource) throw new NotFoundException('资源不存在')

    const existing = await this.prisma.resourceLike.findUnique({
      where: { resourceId_userId: { resourceId: id, userId } },
    })
    if (!existing) {
      await this.prisma.resourceLike.create({ data: { resourceId: id, userId } })
      await this.prisma.resource.update({ where: { id }, data: { likeCount: { increment: 1 } } })
    }
    return { likeCount: resource.likeCount + (existing ? 0 : 1), isLiked: true }
  }

  async unlike(id: number, userId: number) {
    const resource = await this.prisma.resource.findFirst({
      where: { id, status: 'published' },
    })
    if (!resource) throw new NotFoundException('资源不存在')

    const existing = await this.prisma.resourceLike.findUnique({
      where: { resourceId_userId: { resourceId: id, userId } },
    })
    if (existing) {
      await this.prisma.resourceLike.delete({ where: { id: existing.id } })
      const newCount = Math.max(0, resource.likeCount - 1)
      await this.prisma.resource.update({ where: { id }, data: { likeCount: newCount } })
      return { likeCount: newCount, isLiked: false }
    }
    return { likeCount: resource.likeCount, isLiked: false }
  }

  async recordDownload(id: number) {
    const resource = await this.prisma.resource.findFirst({
      where: { id, status: 'published' },
    })
    if (!resource) throw new NotFoundException('资源不存在')
    await this.prisma.resource.update({ where: { id }, data: { downloadCount: { increment: 1 } } })
    return { downloadCount: resource.downloadCount + 1 }
  }
}
