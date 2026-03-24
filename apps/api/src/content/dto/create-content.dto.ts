import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { AccessRule, ContentType } from '@prisma/client';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateContentDto {
  @IsEnum(ContentType)
  @ApiProperty({ enum: ContentType, example: ContentType.IMAGE })
  type!: ContentType;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ example: 'media/key.jpg' })
  mediaKey?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ example: 'Text-only post content' })
  text?: string;

  @IsOptional()
  @IsEnum(AccessRule)
  @ApiPropertyOptional({ enum: AccessRule, example: AccessRule.SUBSCRIPTION })
  accessRule?: AccessRule;

  @IsOptional()
  @IsInt()
  @Min(0)
  @ApiPropertyOptional({ example: 499 })
  price?: number;
}
