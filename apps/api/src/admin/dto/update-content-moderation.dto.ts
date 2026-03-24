import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateContentModerationDto {
  @IsBoolean()
  @ApiProperty({ example: true })
  isHidden!: boolean;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ example: 'Policy violation' })
  reason?: string;
}
