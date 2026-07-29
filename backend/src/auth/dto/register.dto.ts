import { IsString, MinLength, MaxLength, IsNotEmpty } from 'class-validator'

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(32)
  studentId: string

  @IsString()
  @MinLength(6)
  @MaxLength(64)
  password: string

  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(64)
  nickname: string
}
