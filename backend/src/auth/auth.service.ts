import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcryptjs'
import { PrismaService } from '../prisma/prisma.service.js'
import { RegisterDto } from './dto/register.dto.js'
import { LoginDto } from './dto/login.dto.js'
import { ChangePasswordDto } from './dto/change-password.dto.js'
import { JwtPayload } from './strategies/jwt.strategy.js'

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.prisma.user.findUnique({
      where: { studentId: dto.studentId },
    })
    if (existing) {
      throw new ConflictException('该学号已注册')
    }

    const passwordHash = await bcrypt.hash(dto.password, 10)

    const user = await this.prisma.user.create({
      data: {
        studentId: dto.studentId,
        passwordHash,
        nickname: dto.nickname,
      },
    })

    const token = this.createToken(user.id, user.studentId, user.role)
    return {
      access_token: token,
      token_type: 'bearer',
      user: this.sanitizeUser(user),
    }
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { studentId: dto.studentId },
    })
    if (!user) {
      throw new UnauthorizedException('学号或密码错误')
    }

    const valid = await bcrypt.compare(dto.password, user.passwordHash)
    if (!valid) {
      throw new UnauthorizedException('学号或密码错误')
    }

    const token = this.createToken(user.id, user.studentId, user.role)
    return {
      access_token: token,
      token_type: 'bearer',
      user: this.sanitizeUser(user),
    }
  }

  async getMe(userId: number) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } })
    if (!user) {
      throw new UnauthorizedException('用户不存在')
    }
    return this.sanitizeUser(user)
  }

  async changePassword(userId: number, dto: ChangePasswordDto) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } })
    if (!user) {
      throw new UnauthorizedException('用户不存在')
    }

    const valid = await bcrypt.compare(dto.oldPassword, user.passwordHash)
    if (!valid) {
      throw new BadRequestException('原密码不正确')
    }

    const passwordHash = await bcrypt.hash(dto.newPassword, 10)
    await this.prisma.user.update({
      where: { id: userId },
      data: { passwordHash },
    })
  }

  // ---------- helpers ----------

  private createToken(userId: number, studentId: string, role: string): string {
    const payload: Omit<JwtPayload, 'exp' | 'iat'> = {
      sub: String(userId),
      sid: studentId,
      role,
    }
    return this.jwtService.sign(payload)
  }

  private sanitizeUser(user: any) {
    const { passwordHash, ...rest } = user
    return rest
  }
}
