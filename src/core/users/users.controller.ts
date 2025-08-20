import { Controller, Post, Body, UseGuards, Patch, Param, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { RoleEnum } from '../role/enum/role.enum';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/role.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Request } from 'express';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.ADMIN)
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  @Patch('switch-role/:role')
  @UseGuards(JwtAuthGuard)
  async switchRole(@Req() req: Request & { user: { sub: string } }, @Param('role') role: RoleEnum) {
    return this.usersService.switchActiveRole(req.user.sub, role);
  }
}