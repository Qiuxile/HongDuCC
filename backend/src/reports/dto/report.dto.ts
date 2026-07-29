import { IsString, IsInt, IsOptional, MaxLength } from 'class-validator'

export class CreateReportDto {
  @IsString()
  targetType: string

  @IsInt()
  targetId: number

  @IsString()
  @MaxLength(256)
  reason: string

  @IsOptional()
  @IsString()
  detail?: string
}
