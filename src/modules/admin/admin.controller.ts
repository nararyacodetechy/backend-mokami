// src/modules/admin/admin.controller.ts
import { Controller, Get, UseGuards } from '@nestjs/common';
import { Roles } from 'src/core/auth/decorators/role.decorator';
import { JwtAuthGuard } from 'src/core/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/core/auth/guards/roles.guard';
import { RoleEnum } from 'src/core/role/enum/role.enum';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminController {
  @Get('dashboard')
  @Roles(RoleEnum.ADMIN)
  getAdminDashboard() {
    return { message: 'Welcome Admin Dashboard!' };
  }
}
