import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { AccessRule } from '@prisma/client';

export class UpdateContentDto {
  @IsOptional()
  @IsString()
  text?: string;

  @IsOptional()
  @IsString()
  mediaKey?: string;

  @IsOptional()
  @IsEnum(AccessRule)
  accessRule?: AccessRule;

  @IsOptional()
  @IsInt()
  @Min(0)
  price?: number;
}
