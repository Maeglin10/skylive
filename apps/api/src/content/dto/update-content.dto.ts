import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { AccessRule } from '@prisma/client';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateContentDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ example: 'Updated text content' })
  text?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ example: 'media/key-updated.jpg' })
  mediaKey?: string;

  @IsOptional()
  @IsEnum(AccessRule)
  @ApiPropertyOptional({ enum: AccessRule, example: AccessRule.PPV })
  accessRule?: AccessRule;

  @IsOptional()
  @IsInt()
  @Min(0)
  @ApiPropertyOptional({ example: 999 })
  price?: number;
}
