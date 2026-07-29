import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service.js'
import { CreateNewsDto, UpdateNewsDto } from './dto/news.dto.js'

@Injectable()
export class NewsService {
  constructor(private prisma: PrismaService) {}

  async list(page = 1, pageSize = 12, category?: string) {
    const where: any = { status: 'published' }
    if (category) where.category = category

    const [items, total] = await Promise.all([
      this.prisma.news.findMany({
        where,
        orderBy: [{ isPinned: 'desc' }, { createdAt: 'desc' }],
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      this.prisma.news.count({ where }),
    ])

    return {
      list: items,
      total,
      page,
      pageSize,
      totalPages: Math.max(1, Math.ceil(total / pageSize)),
    }
  }

  async getById(id: number) {
    const news = await this.prisma.news.findFirst({
      where: { id, status: 'published' },
    })
    if (!news) throw new NotFoundException('新闻不存在')

    await this.prisma.news.update({ where: { id }, data: { viewCount: { increment: 1 } } })
    return news
  }

  async create(dto: CreateNewsDto, authorId: number) {
    return this.prisma.news.create({
      data: { ...dto, authorId },
    })
  }

  async update(id: number, dto: UpdateNewsDto) {
    const news = await this.prisma.news.findUnique({ where: { id } })
    if (!news) throw new NotFoundException('新闻不存在')
    return this.prisma.news.update({ where: { id }, data: dto })
  }

  async softDelete(id: number) {
    const news = await this.prisma.news.findUnique({ where: { id } })
    if (!news) throw new NotFoundException('新闻不存在')
    await this.prisma.news.update({ where: { id }, data: { status: 'deleted' } })
  }
}
