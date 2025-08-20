import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { Users } from './entity/users.entity';
import { UserProfiles } from '../profile/entity/user-profiles.entity';
import { Roles } from '../role/entity/roles.entity';
import { UserRoles } from '../role/entity/user-roles.entity';
import { UserSessions } from './entity/users-sessions.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Users, UserSessions, UserProfiles, Roles, UserRoles]),
    forwardRef(() => AuthModule),// Import AuthModule to provide JwtService and guards
  ],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}