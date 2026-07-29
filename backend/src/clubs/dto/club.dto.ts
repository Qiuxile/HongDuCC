import { IsString, IsOptional, IsInt, MaxLength } from 'class-validator'

export class CreateClubDto {
  @IsString()
  @MaxLength(128)
  name: string

  @IsString()
  category: string

  @IsOptional()
  @IsString()
  description?: string

  @IsOptional()
  @IsString()
  coverUrl?: string

  @IsOptional()
  @IsString()
  advisor?: string

  @IsOptional()
  @IsString()
  meetingTime?: string

  @IsOptional()
  @IsString()
  location?: string

  @IsOptional()
  @IsInt()
  maxMembers?: number
}

export class UpdateClubDto {
  @IsOptional()
  @IsString()
  @MaxLength(128)
  name?: string

  @IsOptional()
  @IsString()
  description?: string

  @IsOptional()
  @IsString()
  coverUrl?: string

  @IsOptional()
  @IsString()
  category?: string

  @IsOptional()
  @IsString()
  advisor?: string

  @IsOptional()
  @IsString()
  meetingTime?: string

  @IsOptional()
  @IsString()
  location?: string

  @IsOptional()
  @IsInt()
  maxMembers?: number

  @IsOptional()
  @IsString()
  status?: string
}

export class CreateEventDto {
  @IsString()
  @MaxLength(256)
  title: string

  @IsString()
  startTime: string

  @IsOptional()
  @IsString()
  description?: string

  @IsOptional()
  @IsString()
  endTime?: string

  @IsOptional()
  @IsString()
  location?: string
}
