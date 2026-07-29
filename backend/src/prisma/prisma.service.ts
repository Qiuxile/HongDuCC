import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common'
import { PrismaClient } from '../../generated/prisma/client.js'
import { PrismaPg } from '@prisma/adapter-pg'

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    const url = new URL(process.env.DATABASE_URL!)
    url.searchParams.set('client_encoding', 'UTF8')
    const adapter = new PrismaPg({
      connectionString: url.toString(),
    })
    super({ adapter })
  }

  async onModuleInit() {
    await this.$connect()
  }

  async onModuleDestroy() {
    await this.$disconnect()
  }
}
