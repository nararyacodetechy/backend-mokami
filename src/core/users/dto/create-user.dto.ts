import { Type } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString, MinLength, IsArray, IsUUID, IsEnum, IsOptional, ValidateNested } from 'class-validator';
import { CreateUserProfileDto } from 'src/core/profile/dto/create-profile.dto';
import { RoleEnum } from 'src/core/role/enum/role.enum';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  password: string;

  // why we need this?
  @IsArray()
  @IsEnum(RoleEnum, { each: true })
  roles: RoleEnum[];

  @ValidateNested()
  @Type(() => CreateUserProfileDto)
  profile: CreateUserProfileDto;
}
