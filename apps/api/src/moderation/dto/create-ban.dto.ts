import { IsDateString, IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateBanDto {
  @IsUUID()
  @ApiProperty({ example: '0f2b7b63-5d4d-4b89-8c4b-4d64c0e4efc1' })
  userId!: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ example: 'Abuse report confirmed' })
  reason?: string;

  @IsOptional()
  @IsDateString()
  @ApiPropertyOptional({ example: '2026-04-30T12:00:00.000Z' })
  expiresAt?: string;
}
