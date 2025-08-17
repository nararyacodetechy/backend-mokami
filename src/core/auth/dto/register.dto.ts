import { Type } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsStrongPassword, IsArray, ArrayNotEmpty, IsEnum, ValidateNested } from 'class-validator';
import { CreateUserProfileDto } from 'src/core/profile/dto/create-profile.dto';
import { RoleEnum } from 'src/core/role/enum/role.enum';

export class RegisterDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  })
  password: string;

  @ValidateNested()
  @Type(() => CreateUserProfileDto)
  profile: CreateUserProfileDto;

  @IsArray()
  @ArrayNotEmpty()
  @IsEnum(RoleEnum, { each: true })
  roles: RoleEnum[];
}