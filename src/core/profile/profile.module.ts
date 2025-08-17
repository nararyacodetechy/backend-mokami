import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { Users } from '../users/entity/users.entity';
import { UserProfiles } from './entity/user-profiles.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Users, UserProfiles])],
  controllers: [ProfileController],
  providers: [ProfileService],
  exports: [TypeOrmModule, ProfileService],
})
export class ProfileModule {}