// src/modules/user/users.service.ts
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Users } from './entity/users.entity';
import { UserProfiles } from 'src/core/profile/entity/user-profiles.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { Roles } from 'src/core/role/entity/roles.entity';
import { UserRoles } from 'src/core/role/entity/user-roles.entity';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcrypt';
import { RoleEnum } from 'src/core/role/enum/role.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private readonly userRepository: Repository<Users>,
    @InjectRepository(UserProfiles)
    private readonly userProfilesRepository: Repository<UserProfiles>,
    @InjectRepository(Roles)
    private readonly roleRepository: Repository<Roles>,
    @InjectRepository(UserRoles)
    private readonly userRolesRepository: Repository<UserRoles>,
  ) {}

  async findByEmail(email: string) {
    return this.userRepository.findOne({
      where: { email },
      relations: ['profile', 'roles', 'activeRole'],
    });
  }

  async create(data: Partial<Users>) {
    return this.userRepository.create(data);
  }

  async createUserWithRoleNames(dto: CreateUserDto) {
    const existing = await this.userRepository.findOne({ where: { email: dto.email } });
    if (existing) throw new BadRequestException('Email already exists');

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = this.userRepository.create({
      id: uuidv4(),
      email: dto.email,
      hashedPassword,
      isEmailVerified: false, // Set to false initially, as email verification is required
    });

    const savedUser = await this.userRepository.save(user);

    // Create user profile
    const profile = this.userProfilesRepository.create({
      id: uuidv4(),
      userId: savedUser,
      fullName: dto.profile.fullName,
      username: dto.profile.username,
      nik: dto.profile.nik,
      address: dto.profile.address,
      phone: dto.profile.phone,
      company: dto.profile.company,
      imageProfile: dto.profile.imageProfile,
    });
    await this.userProfilesRepository.save(profile);

    // Assign roles
    const roles = await this.roleRepository.find({
      where: { role_name: In(dto.roles ?? [RoleEnum.USER]) }, // Default to USER if no roles provided
    });
    if (!roles.length) throw new NotFoundException('No roles found');

    for (const role of roles) {
      await this.userRolesRepository.save({
        id: uuidv4(),
        userId: savedUser.id,
        roleId: role.id,
      });
    }

    // Set default active role (first role or USER)
    savedUser.activeRole = roles.find(r => r.role_name === RoleEnum.USER) || roles[0];
    await this.userRepository.save(savedUser);

    return {
      status: 'success',
      message: 'User created successfully',
      user: {
        id: savedUser.id,
        email: savedUser.email,
        isEmailVerified: savedUser.isEmailVerified,
        roles: roles.map(r => r.role_name as RoleEnum),
        activeRole: savedUser.activeRole.role_name as RoleEnum,
        profile: {
          id: profile.id,
          userId: savedUser.id,
          fullName: profile.fullName,
          username: profile.username,
          nik: profile.nik,
          address: profile.address,
          phone: profile.phone,
          company: profile.company,
          imageProfile: profile.imageProfile,
        },
      },
    };
  }

  async switchActiveRole(userId: string, newRole: RoleEnum) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['roles', 'activeRole', 'profile'],
    });
    if (!user) throw new NotFoundException('User not found');

    const role = await this.roleRepository.findOne({ where: { role_name: newRole } });
    if (!role) throw new NotFoundException('Role not found');

    // Check if user has the requested role
    const userHasRole = user.roles.some(r => r.role_name === newRole);
    if (!userHasRole) throw new BadRequestException('User does not have this role');

    // Update active role
    user.activeRole = role;
    await this.userRepository.save(user);

    return {
      status: 'success',
      message: 'Active role updated successfully',
      user: {
        id: user.id,
        email: user.email,
        isEmailVerified: user.isEmailVerified,
        roles: user.roles.map(r => r.role_name as RoleEnum),
        activeRole: role.role_name as RoleEnum,
        profile: {
          id: user.profile.id,
          userId: user.id,
          fullName: user.profile.fullName,
          username: user.profile.username,
          nik: user.profile.nik,
          address: user.profile.address,
          phone: user.profile.phone,
          company: user.profile.company,
          imageProfile: user.profile.imageProfile,
        },
      },
    };
  }
}