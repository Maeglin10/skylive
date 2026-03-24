import { IsEnum } from 'class-validator';
import { ReportStatus } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateReportDto {
  @IsEnum(ReportStatus)
  @ApiProperty({ enum: ReportStatus, example: ReportStatus.REVIEWED })
  status!: ReportStatus;
}
