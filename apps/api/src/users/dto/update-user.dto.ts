import { IsOptional, IsString, IsUrl } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ example: 'Jane Doe' })
  displayName?: string;

  @IsOptional()
  @IsUrl()
  @ApiPropertyOptional({ example: 'https://cdn.example.com/avatar.png' })
  avatarUrl?: string;
}
