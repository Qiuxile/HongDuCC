import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { APP_GUARD, APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core'
import { AppController } from './app.controller.js'
import { AppService } from './app.service.js'
import { PrismaModule } from './prisma/prisma.module.js'
import { AuthModule } from './auth/auth.module.js'
import { UsersModule } from './users/users.module.js'
import { NewsModule } from './news/news.module.js'
import { ResourcesModule } from './resources/resources.module.js'
import { CommentsModule } from './comments/comments.module.js'
import { FeedsModule } from './feeds/feeds.module.js'
import { SocialModule } from './social/social.module.js'
import { ClubsModule } from './clubs/clubs.module.js'
import { NotificationsModule } from './notifications/notifications.module.js'
import { ReportsModule } from './reports/reports.module.js'
import { AdminModule } from './admin/admin.module.js'
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard.js'
import { AllExceptionsFilter } from './common/filters/http-exception.filter.js'
import { ResponseInterceptor } from './common/interceptors/response.interceptor.js'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    UsersModule,
    NewsModule,
    ResourcesModule,
    CommentsModule,
    FeedsModule,
    SocialModule,
    ClubsModule,
    NotificationsModule,
    ReportsModule,
    AdminModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_INTERCEPTOR, useClass: ResponseInterceptor },
    { provide: APP_FILTER, useClass: AllExceptionsFilter },
  ],
})
export class AppModule {}
