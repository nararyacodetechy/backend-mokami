import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from '../users/entity/users.entity';
import { RoleEnum } from '../role/enum/role.enum';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Users)
    private readonly userRepository: Repository<Users>,
  ) {}

  async getProfile(userId: string) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['roles', 'activeRole'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Base profile data
    const profile = {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      roles: user.roles.map((r) => r.name),
      activeRole: user.activeRole?.name || 'user',
    };

    // Role-specific data
    let roleSpecificData = {};

    switch (user.activeRole?.name) {
      case RoleEnum.CUSTOMER:
        roleSpecificData = {
          orders: [], // Placeholder: Fetch from OrderService
        };
        break;
      case RoleEnum.DEVELOPER:
        roleSpecificData = {
          tasks: [], // Placeholder: Fetch from TaskService
        };
        break;
      case RoleEnum.ADMIN:
        roleSpecificData = {
          adminPrivileges: ['manage-users', 'manage-roles'], // Example
        };
        break;
      case RoleEnum.SALES:
        roleSpecificData = {
          salesTargets: [], // Placeholder
        };
        break;
      case RoleEnum.MARKETING:
        roleSpecificData = {
          campaigns: [], // Placeholder
        };
        break;
      case RoleEnum.PRODUCT_MANAGER:
        roleSpecificData = {
          products: [], // Placeholder
        };
        break;
      case RoleEnum.DESIGNER:
        roleSpecificData = {
          designs: [], // Placeholder
        };
        break;
      case RoleEnum.DEVOPS:
        roleSpecificData = {
          deployments: [], // Placeholder
        };
        break;
      default:
        roleSpecificData = {};
    }

    return { ...profile, ...roleSpecificData };
  }
}