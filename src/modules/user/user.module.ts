import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderModule } from './order/order.module';
import { Users } from 'src/core/users/entity/users.entity';
import { UserProfiles } from 'src/core/profile/entity/user-profiles.entity';
import { Roles } from 'src/core/role/entity/roles.entity';
import { UserRoles } from 'src/core/role/entity/user-roles.entity';
import { UsersService } from 'src/core/users/users.service';
import { UsersController } from 'src/core/users/users.controller';
import { UserSessions } from 'src/core/users/entity/users-sessions.entity';
import { AuthModule } from 'src/core/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Users, UserProfiles, Roles, UserRoles, UserSessions]),
    OrderModule,
    forwardRef(() => AuthModule), // Use forwardRef Import AuthModule to provide JwtService and repositories
  ],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UserModule {}