import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RegisterDto {
  @IsEmail()
  @ApiProperty({ example: 'user@example.com' })
  email!: string;

  @IsString()
  @MinLength(8)
  @ApiProperty({ example: 'Password123!' })
  password!: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ example: 'Jane Doe' })
  displayName?: string;
}
