import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class BlockUserDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ example: 'Spam messages' })
  reason?: string;
}
