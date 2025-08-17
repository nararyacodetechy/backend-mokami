import { IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator";

export class CreateUserProfileDto {
  @IsNotEmpty()
  fullName: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  username?: string;

  @IsOptional()
  nik?: string;

  @IsOptional()
  address?: string;

  @IsOptional()
  phone?: string;

  @IsOptional()
  company?: string;

  @IsOptional()
  imageProfile?: string;
}