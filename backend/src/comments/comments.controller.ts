import { Controller, Get, Post, Delete, Param, Body, Query, UseGuards } from '@nestjs/common'
import { CommentsService } from './comments.service.js'
import { CreateCommentDto } from './dto/comment.dto.js'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js'
import { CurrentUser } from '../common/decorators/current-user.decorator.js'
import { Public } from '../common/decorators/public.decorator.js'

@Controller('api/comments')
export class CommentsController {
  constructor(private commentsService: CommentsService) {}

  @Public()
  @Get()
  list(@Query('targetType') targetType: string, @Query('targetId') targetId: string) {
    return this.commentsService.listByTarget(targetType, parseInt(targetId))
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateCommentDto, @CurrentUser('id') userId: number) {
    return this.commentsService.create(dto, userId)
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  delete(@Param('id') id: string, @CurrentUser() user: any) {
    return this.commentsService.softDelete(parseInt(id), user.id, user.role)
  }
}
