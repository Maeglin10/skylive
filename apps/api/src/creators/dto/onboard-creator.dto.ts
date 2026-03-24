import { IsInt, IsOptional, IsString, Min, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class OnboardCreatorDto {
  @IsString()
  @MinLength(3)
  @ApiProperty({ example: 'creator_jane' })
  username!: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ example: 'Creator bio' })
  bio?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  @ApiPropertyOptional({ example: 999 })
  subscriptionPrice?: number;
}
