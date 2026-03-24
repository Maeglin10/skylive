import { IsEnum, IsInt, IsOptional, IsString, Min, MinLength } from 'class-validator';
import { AccessRule } from '@prisma/client';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateLiveSessionDto {
  @IsString()
  @MinLength(3)
  @ApiProperty({ example: 'Live Q&A Session' })
  title!: string;

  @IsEnum(AccessRule)
  @ApiProperty({ enum: AccessRule, example: AccessRule.SUBSCRIPTION })
  accessRule!: AccessRule;

  @IsOptional()
  @IsInt()
  @Min(0)
  @ApiPropertyOptional({ example: 799 })
  price?: number;
}
