import { IsString, IsOptional, MinLength } from 'class-validator'

export class CreateFeedDto {
  @IsString()
  @MinLength(1)
  content: string

  @IsOptional()
  images?: string[]
}
