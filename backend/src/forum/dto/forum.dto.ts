import { IsString, IsOptional, MaxLength, MinLength } from 'class-validator'

export class CreatePostDto {
  @IsString()
  @MaxLength(256)
  title: string

  @IsString()
  @MinLength(1)
  content: string

  @IsOptional()
  @IsString()
  category?: string

  @IsOptional()
  @IsString()
  topicName?: string
}

export class UpdatePostDto {
  @IsOptional()
  @IsString()
  @MaxLength(256)
  title?: string

  @IsOptional()
  @IsString()
  content?: string

  @IsOptional()
  @IsString()
  category?: string
}
