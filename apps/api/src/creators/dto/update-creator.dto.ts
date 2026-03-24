import { IsInt, IsOptional, IsString, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateCreatorDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ example: 'Updated bio' })
  bio?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  @ApiPropertyOptional({ example: 1499 })
  subscriptionPrice?: number;
}
