import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { Users } from './entity/users.entity';
import { Role } from '../role/entity/role.entity';
import { UserRole } from '../role/entity/user-roles.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Users, Role, UserRole])],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
