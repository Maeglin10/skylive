import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { AccessRule, ContentType } from '@prisma/client';

export class CreateContentDto {
  @IsEnum(ContentType)
  type!: ContentType;

  @IsOptional()
  @IsString()
  mediaKey?: string;

  @IsOptional()
  @IsString()
  text?: string;

  @IsOptional()
  @IsEnum(AccessRule)
  accessRule?: AccessRule;

  @IsOptional()
  @IsInt()
  @Min(0)
  price?: number;
}
