import { IsString, IsInt, IsOptional, MinLength } from 'class-validator'

export class CreateCommentDto {
  @IsString()
  targetType: string

  @IsInt()
  targetId: number

  @IsOptional()
  @IsInt()
  parentId?: number

  @IsString()
  @MinLength(1)
  content: string
}
