import { Controller, Get, Post, Put, Param, Body, Query, UseGuards } from '@nestjs/common'
import { ReportsService } from './reports.service.js'
import { CreateReportDto } from './dto/report.dto.js'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js'
import { AdminGuard } from '../auth/guards/admin.guard.js'
import { CurrentUser } from '../common/decorators/current-user.decorator.js'

@Controller('api/reports')
export class ReportsController {
  constructor(private reportsService: ReportsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  submit(@Body() dto: CreateReportDto, @CurrentUser('id') userId: number) {
    return this.reportsService.submit(dto, userId)
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Get()
  list(@Query('page') page?: number, @Query('pageSize') pageSize?: number, @Query('status') status?: string) {
    return this.reportsService.list(page, pageSize, status)
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Put(':id/resolve')
  resolve(@Param('id') id: string, @CurrentUser('id') handlerId: number) {
    return this.reportsService.resolve(parseInt(id), handlerId)
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Put(':id/dismiss')
  dismiss(@Param('id') id: string, @CurrentUser('id') handlerId: number) {
    return this.reportsService.dismiss(parseInt(id), handlerId)
  }
}
