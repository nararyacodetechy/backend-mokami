// src/core/profile/profile.module.ts

import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { Users } from '../users/entity/users.entity';
import { UserProfiles } from './entity/user-profiles.entity';
import { AuthModule } from '../auth/auth.module';
import { Roles } from '../role/entity/roles.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Users, UserProfiles, Roles]), // Add Roles
    forwardRef(() => AuthModule), // Import AuthModule for JwtService and guards
  ],
  controllers: [ProfileController],
  providers: [ProfileService],
  exports: [TypeOrmModule, ProfileService],
})
export class ProfileModule {}