import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service.js'
import { UpdateUserDto } from './dto/update-user.dto.js'

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  /** Get current user's own profile with stats */
  async getMyProfile(userId: number) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } })
    if (!user) throw new NotFoundException('用户不存在')

    const [followingCount, followersCount, resourcesCount] = await Promise.all([
      this.prisma.follow.count({ where: { followerId: userId } }),
      this.prisma.follow.count({ where: { followedId: userId } }),
      this.prisma.resource.count({ where: { authorId: userId, status: 'published' } }),
    ])

    const { passwordHash, ...profile } = user
    return { ...profile, followingCount, followersCount, resourcesCount }
  }

  /** Update current user's own profile */
  async updateMyProfile(userId: number, dto: UpdateUserDto) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: dto,
    })
    const { passwordHash, ...profile } = user
    return profile
  }

  /** Get user by ID with stats + optional follow status */
  async getUserById(userId: number, currentUserId?: number) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } })
    if (!user) throw new NotFoundException('用户不存在')

    const [followingCount, followersCount] = await Promise.all([
      this.prisma.follow.count({ where: { followerId: userId } }),
      this.prisma.follow.count({ where: { followedId: userId } }),
    ])

    const { passwordHash, ...profile } = user
    const result: any = { ...profile, followingCount, followersCount }

    if (currentUserId && currentUserId !== userId) {
      const follow = await this.prisma.follow.findUnique({
        where: { followerId_followedId: { followerId: currentUserId, followedId: userId } },
      })
      result.isFollowing = !!follow
    }

    return result
  }

  /** Get user by student ID with stats */
  async getUserByStudentId(studentId: string, currentUserId?: number) {
    const user = await this.prisma.user.findUnique({ where: { studentId } })
    if (!user) throw new NotFoundException('用户不存在')

    return this.getUserById(user.id, currentUserId)
  }

  /** Update user (self or admin) */
  async updateUser(targetUserId: number, dto: UpdateUserDto, currentUserId: number, currentUserRole: string) {
    if (currentUserId !== targetUserId && currentUserRole !== 'admin') {
      throw new ForbiddenException('无权限')
    }

    const user = await this.prisma.user.update({
      where: { id: targetUserId },
      data: dto,
    })
    const { passwordHash, ...profile } = user
    return profile
  }
}
