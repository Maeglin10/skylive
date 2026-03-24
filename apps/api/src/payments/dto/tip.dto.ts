import { IsInt, IsOptional, IsString, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class TipDto {
  @IsInt()
  @Min(50)
  @ApiProperty({ example: 500 })
  amount!: number;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ example: 'Thanks for the stream!' })
  message?: string;
}
