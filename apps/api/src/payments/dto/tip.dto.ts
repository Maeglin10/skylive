import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class TipDto {
  @IsInt()
  @Min(50)
  amount!: number;

  @IsOptional()
  @IsString()
  message?: string;
}
