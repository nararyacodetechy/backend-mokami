import { IsEmail, IsNotEmpty, IsString, MinLength, IsArray, IsUUID, IsEnum, IsOptional } from 'class-validator';
import { RoleEnum } from 'src/core/role/enum/role.enum';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsOptional()
  @IsEnum(RoleEnum, { each: true })
  roles?: RoleEnum[];

  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsUUID()
  roleId: string;
}
