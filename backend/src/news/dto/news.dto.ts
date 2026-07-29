import { IsString, IsOptional, MaxLength, IsBoolean } from 'class-validator'

export class CreateNewsDto {
  @IsString()
  @MaxLength(256)
  title: string

  @IsOptional()
  @IsString()
  summary?: string

  @IsOptional()
  @IsString()
  content?: string

  @IsOptional()
  @IsString()
  coverUrl?: string

  @IsOptional()
  @IsString()
  category?: string
}

export class UpdateNewsDto {
  @IsOptional()
  @IsString()
  @MaxLength(256)
  title?: string

  @IsOptional()
  @IsString()
  summary?: string

  @IsOptional()
  @IsString()
  content?: string

  @IsOptional()
  @IsString()
  coverUrl?: string

  @IsOptional()
  @IsString()
  category?: string

  @IsOptional()
  @IsBoolean()
  isPinned?: boolean
}

export class NewsQueryDto {
  @IsOptional()
  page?: number

  @IsOptional()
  pageSize?: number

  @IsOptional()
  @IsString()
  category?: string
}
