import { IsString, IsOptional, MaxLength } from 'class-validator'

export class CreateResourceDto {
  @IsString()
  @MaxLength(256)
  title: string

  @IsString()
  category: string

  @IsString()
  @MaxLength(256)
  fileName: string

  @IsString()
  @MaxLength(512)
  filePath: string

  @IsOptional()
  @IsString()
  description?: string

  @IsOptional()
  @IsString()
  subject?: string

  @IsOptional()
  @IsString()
  grade?: string

  @IsOptional()
  fileSize?: number

  @IsOptional()
  @IsString()
  fileType?: string
}

export class UpdateResourceDto {
  @IsOptional()
  @IsString()
  @MaxLength(256)
  title?: string

  @IsOptional()
  @IsString()
  description?: string

  @IsOptional()
  @IsString()
  category?: string

  @IsOptional()
  @IsString()
  subject?: string

  @IsOptional()
  @IsString()
  grade?: string
}
