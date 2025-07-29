import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { Users } from "./entity/users.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Repository } from "typeorm";
import { CreateUserDto } from "./dto/create-user.dto";
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcrypt';
import { Role } from "../role/entity/role.entity";
import { UserRole } from "../role/entity/user-roles.entity";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private readonly userRepository: Repository<Users>, // inject custom repo
    
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,

    @InjectRepository(UserRole)
    private readonly userRolesRepository: Repository<UserRole>,
  ) {}

  async findByEmail(email: string) {
    return this.userRepository.findOne({ where: { email } });
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
      fullName: dto.fullName,
      isEmailVerified: true,
    });
  
    const savedUser = await this.userRepository.save(user);
  
    const roles = await this.roleRepository.find({
      where: { name: In(dto.roles ?? []) }, // support roles kosong
    });
  
    if (!roles.length) throw new NotFoundException('No roles found');
  
    for (const role of roles) {
      await this.userRolesRepository.save({
        id: uuidv4(),
        userId: savedUser.id,
        roleId: role.id,
      });
    }
  
    savedUser.activeRole = roles[0];
    await this.userRepository.save(savedUser);
  
    return {
      status: 'success',
      message: 'User created successfully',
      user: {
        id: savedUser.id,
        email: savedUser.email,
        fullName: savedUser.fullName,
        isEmailVerified: savedUser.isEmailVerified,
        roles: roles.map(r => r.name),
        activeRole: roles[0].name,
      },
    };    
  }  

  async updateUserRole(userId: string, newRoleId: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');
  
    const role = await this.roleRepository.findOne({ where: { id: newRoleId } });
    if (!role) throw new NotFoundException('Role not found');
  
    // Optional: hapus role sebelumnya (kalau hanya boleh punya satu)
    await this.userRolesRepository.delete({ userId });
  
    // Tambahkan role baru
    await this.userRolesRepository.save({
      id: uuidv4(),
      userId,
      roleId: role.id,
    });
  
    // Set activeRole di user (kalau pakai relasi)
    user.activeRole = role;
    await this.userRepository.save(user);
  
    return {
      status: 'success',
      message: 'User role updated successfully',
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        isEmailVerified: user.isEmailVerified,
        roles: [role.name],
        activeRole: role.name,
      },
    };    
  }
}
