import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { Users } from '../users/entity/users.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Users])],
  providers: [ProfileService],
  controllers: [ProfileController],
})
export class ProfileModule {}