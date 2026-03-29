import { IsString, IsOptional, IsIn } from 'class-validator';

export class PresignDto {
  @IsString()
  fileName: string;

  @IsString()
  contentType: string;

  @IsOptional()
  @IsIn(['avatar', 'content', 'thumbnail'])
  folder?: 'avatar' | 'content' | 'thumbnail';
}
