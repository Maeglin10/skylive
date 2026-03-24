import { IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { ReportTargetType } from '@prisma/client';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateReportDto {
  @IsEnum(ReportTargetType)
  @ApiProperty({ enum: ReportTargetType, example: ReportTargetType.CONTENT })
  targetType!: ReportTargetType;

  @IsString()
  @MinLength(3)
  @ApiProperty({ example: 'content_id_or_live_id' })
  targetId!: string;

  @IsString()
  @MinLength(3)
  @ApiProperty({ example: 'Abusive content' })
  reason!: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ example: 'Additional details here.' })
  details?: string;
}
