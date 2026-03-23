import { IsEnum, IsInt, IsOptional, IsString, Min, MinLength } from 'class-validator';
import { AccessRule } from '@prisma/client';

export class CreateLiveSessionDto {
  @IsString()
  @MinLength(3)
  title!: string;

  @IsEnum(AccessRule)
  accessRule!: AccessRule;

  @IsOptional()
  @IsInt()
  @Min(0)
  price?: number;
}
