import { IsInt, IsOptional, IsString, Min, MinLength } from 'class-validator';

export class OnboardCreatorDto {
  @IsString()
  @MinLength(3)
  username!: string;

  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  subscriptionPrice?: number;
}
