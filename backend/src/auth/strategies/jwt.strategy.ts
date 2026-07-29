import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { ConfigService } from '@nestjs/config'
import { PrismaService } from '../../prisma/prisma.service.js'

export interface JwtPayload {
  sub: string // user.id as string
  sid: string // student_id
  role: string
  exp: number
  iat: number
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET', 'hongdu-zhongxue-2024-secret-key-change-in-production'),
    })
  }

  async validate(payload: JwtPayload) {
    const user = await this.prisma.user.findUnique({
      where: { id: parseInt(payload.sub) },
    })
    if (!user) {
      throw new UnauthorizedException('用户不存在')
    }
    return {
      id: user.id,
      studentId: user.studentId,
      role: user.role,
    }
  }
}
