import { IsEmail, IsNotEmpty, IsStrongPassword, IsArray, ArrayNotEmpty, IsEnum } from 'class-validator';
import { RoleEnum } from 'src/core/role/enum/role.enum';

export class RegisterDto {
  @IsNotEmpty()
  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  })
  password: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  fullName: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsEnum(RoleEnum, { each: true })
  roles: RoleEnum[]; // e.g. ['admin', 'customer']
}