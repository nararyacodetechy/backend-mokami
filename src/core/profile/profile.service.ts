// src/core/profile/profile.service.ts
import { Injectable, NotFoundException, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from 'src/core/users/entity/users.entity';
import { RoleEnum } from 'src/core/role/enum/role.enum';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Users)
    private readonly userRepository: Repository<Users>,
  ) {}

  async getProfile(userId: string) {
    console.log('ProfileService: Fetching profile for userId', userId);

    if (!userId) {
      console.log('ProfileService: No userId provided');
      throw new HttpException('User ID is required', HttpStatus.BAD_REQUEST);
    }

    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['roles', 'activeRole', 'profile'],
    });

    if (!user) {
      console.log('ProfileService: User not found for ID', userId);
      throw new NotFoundException('User not found');
    }

    console.log('ProfileService: Fetched user', {
      id: user.id,
      email: user.email,
      activeRole: user.activeRole?.role_name,
    });

    const defaultProfile = {
      id: null,
      userId: user.id,
      fullName: null,
      username: null,
      nik: null,
      address: null,
      phone: null,
      company: null,
      imageProfile: null,
    };

    return {
      status: 'success',
      message: 'Profile retrieved successfully',
      data: {
        user: {
          id: user.id,
          email: user.email,
          isEmailVerified: user.isEmailVerified,
          roles: user.roles ? user.roles.map(r => r.role_name as RoleEnum) : [],
          activeRole: (user.activeRole?.role_name as RoleEnum) || RoleEnum.USER,
          profile: user.profile ? {
            id: user.profile.id,
            userId: user.id,
            fullName: user.profile.fullName ?? null,
            username: user.profile.username ?? null,
            nik: user.profile.nik ?? null,
            address: user.profile.address ?? null,
            phone: user.profile.phone ?? null,
            company: user.profile.company ?? null,
            imageProfile: user.profile.imageProfile ?? null,
          } : defaultProfile,
        },
      },
    };
  }
}