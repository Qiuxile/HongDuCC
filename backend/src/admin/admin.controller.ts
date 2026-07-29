import { Controller, Get, Put, Param, Query, UseGuards } from '@nestjs/common'
import { AdminService } from './admin.service.js'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js'
import { AdminGuard } from '../auth/guards/admin.guard.js'

@Controller('api/admin')
@UseGuards(JwtAuthGuard, AdminGuard)
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Get('dashboard')
  dashboard() {
    return this.adminService.dashboard()
  }

  @Get('users')
  listUsers(@Query('page') page?: number, @Query('pageSize') pageSize?: number, @Query('search') search?: string) {
    return this.adminService.listUsers(page, pageSize, search)
  }

  @Put('users/:id/status')
  updateUserStatus(@Param('id') id: string, @Query('status') status: string) {
    return this.adminService.updateUserStatus(parseInt(id), status)
  }
}
