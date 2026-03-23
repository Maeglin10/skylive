import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class UpdateCreatorDto {
  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  subscriptionPrice?: number;
}
