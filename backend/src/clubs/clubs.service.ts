import { Injectable, NotFoundException, ForbiddenException, ConflictException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service.js'
import { CreateClubDto, UpdateClubDto, CreateEventDto } from './dto/club.dto.js'

@Injectable()
export class ClubsService {
  constructor(private prisma: PrismaService) {}

  // ---------- Clubs ----------

  async list(page = 1, pageSize = 12, category?: string) {
    const where: any = { status: 'active' }
    if (category) where.category = category
    const [items, total] = await Promise.all([
      this.prisma.club.findMany({
        where, orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize, take: pageSize,
        include: { leader: { select: { id: true, nickname: true, avatarUrl: true } } },
      }),
      this.prisma.club.count({ where }),
    ])
    return { list: items, total, page, pageSize, totalPages: Math.max(1, Math.ceil(total / pageSize)) }
  }

  async getById(id: number) {
    const club = await this.prisma.club.findUnique({
      where: { id },
      include: { leader: { select: { id: true, nickname: true, avatarUrl: true, role: true } } },
    })
    if (!club) throw new NotFoundException('社团不存在')
    return club
  }

  async create(dto: CreateClubDto, leaderId: number) {
    const club = await this.prisma.club.create({
      data: { ...dto, leaderId },
    })
    // Creator becomes the first member as leader
    await this.prisma.clubMember.create({
      data: { clubId: club.id, userId: leaderId, role: 'leader' },
    })
    return club
  }

  async update(id: number, dto: UpdateClubDto, userId: number, userRole: string) {
    const club = await this.prisma.club.findUnique({ where: { id } })
    if (!club) throw new NotFoundException('社团不存在')
    if (club.leaderId !== userId && userRole !== 'admin') throw new ForbiddenException('无权限')
    return this.prisma.club.update({ where: { id }, data: dto })
  }

  async softDelete(id: number, userId: number, userRole: string) {
    const club = await this.prisma.club.findUnique({ where: { id } })
    if (!club) throw new NotFoundException('社团不存在')
    if (club.leaderId !== userId && userRole !== 'admin') throw new ForbiddenException('无权限')
    await this.prisma.club.update({ where: { id }, data: { status: 'inactive', deletedAt: new Date() } })
  }

  // ---------- Members ----------

  async listMembers(clubId: number) {
    return this.prisma.clubMember.findMany({
      where: { clubId },
      include: { user: { select: { id: true, nickname: true, avatarUrl: true, studentId: true } } },
      orderBy: { joinedAt: 'asc' },
    })
  }

  async join(clubId: number, userId: number) {
    const club = await this.prisma.club.findUnique({ where: { id: clubId } })
    if (!club) throw new NotFoundException('社团不存在')
    if (club.memberCount >= club.maxMembers) throw new ConflictException('社团已满员')

    const existing = await this.prisma.clubMember.findUnique({
      where: { clubId_userId: { clubId, userId } },
    })
    if (existing) throw new ConflictException('已是社团成员')

    await this.prisma.clubMember.create({ data: { clubId, userId, role: 'member' } })
    await this.prisma.club.update({ where: { id: clubId }, data: { memberCount: { increment: 1 } } })
    return { joined: true }
  }

  async leave(clubId: number, userId: number) {
    const membership = await this.prisma.clubMember.findUnique({
      where: { clubId_userId: { clubId, userId } },
    })
    if (!membership) throw new NotFoundException('不是社团成员')
    if (membership.role === 'leader') throw new ConflictException('社长不能退出，请先转让社长')

    await this.prisma.clubMember.delete({ where: { id: membership.id } })
    await this.prisma.club.update({ where: { id: clubId }, data: { memberCount: { increment: -1 } } })
    return { joined: false }
  }

  // ---------- Events ----------

  async listEvents(clubId: number) {
    return this.prisma.clubEvent.findMany({
      where: { clubId },
      orderBy: { startTime: 'asc' },
    })
  }

  async createEvent(clubId: number, dto: CreateEventDto, userId: number) {
    const club = await this.prisma.club.findUnique({ where: { id: clubId } })
    if (!club) throw new NotFoundException('社团不存在')
    // Check user is member with leader/admin role
    const membership = await this.prisma.clubMember.findUnique({
      where: { clubId_userId: { clubId, userId } },
    })
    if (!membership || (membership.role !== 'leader' && membership.role !== 'admin')) {
      throw new ForbiddenException('只有社团管理员可以创建活动')
    }
    return this.prisma.clubEvent.create({
      data: { clubId, ...dto, startTime: new Date(dto.startTime), endTime: dto.endTime ? new Date(dto.endTime) : null, createdBy: userId },
    })
  }
}
