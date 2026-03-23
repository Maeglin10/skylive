import { IsDateString, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateBanDto {
  @IsUUID()
  userId!: string;

  @IsOptional()
  @IsString()
  reason?: string;

  @IsOptional()
  @IsDateString()
  expiresAt?: string;
}
