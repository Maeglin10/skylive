import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class MagicLinkVerifyDto {
  @IsString()
  @MinLength(10)
  @ApiProperty({ example: 'magic_token_value' })
  token!: string;
}
