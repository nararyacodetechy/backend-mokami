import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { Users } from './entity/users.entity';
import { Roles } from '../role/entity/roles.entity';
import { UserRoles } from '../role/entity/user-roles.entity';
import { ProfileModule } from '../profile/profile.module';

@Module({
  imports: [TypeOrmModule.forFeature([Users, Roles, UserRoles]),
  ProfileModule
  ],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
