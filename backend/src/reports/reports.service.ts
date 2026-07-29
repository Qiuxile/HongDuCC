import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service.js'
import { CreateReportDto } from './dto/report.dto.js'

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  async submit(dto: CreateReportDto, reporterId: number) {
    return this.prisma.report.create({
      data: { ...dto, reporterId },
    })
  }

  async list(page = 1, pageSize = 20, status?: string) {
    const where: any = {}
    if (status) where.status = status
    const [items, total] = await Promise.all([
      this.prisma.report.findMany({
        where, orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize, take: pageSize,
        include: {
          reporter: { select: { id: true, nickname: true, studentId: true } },
          handler: { select: { id: true, nickname: true } },
        },
      }),
      this.prisma.report.count({ where }),
    ])
    return { list: items, total, page, pageSize, totalPages: Math.max(1, Math.ceil(total / pageSize)) }
  }

  async resolve(reportId: number, handlerId: number) {
    const report = await this.prisma.report.findUnique({ where: { id: reportId } })
    if (!report) throw new NotFoundException('举报不存在')
    return this.prisma.report.update({
      where: { id: reportId },
      data: { status: 'resolved', handlerId, handledAt: new Date() },
    })
  }

  async dismiss(reportId: number, handlerId: number) {
    const report = await this.prisma.report.findUnique({ where: { id: reportId } })
    if (!report) throw new NotFoundException('举报不存在')
    return this.prisma.report.update({
      where: { id: reportId },
      data: { status: 'dismissed', handlerId, handledAt: new Date() },
    })
  }
}
