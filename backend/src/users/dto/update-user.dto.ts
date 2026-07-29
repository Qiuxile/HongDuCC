import { IsString, IsOptional, MaxLength } from 'class-validator'

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @MaxLength(64)
  nickname?: string

  @IsOptional()
  @IsString()
  avatarUrl?: string

  @IsOptional()
  @IsString()
  bio?: string

  @IsOptional()
  tags?: string[]
}
