// src/modules/developer/developer.controller.ts
import { Controller, Get, UseGuards } from '@nestjs/common';
import { RoleEnum } from 'src/core/role/enum/role.enum';
import { RolesGuard } from 'src/core/auth/guards/roles.guard';
import { JwtAuthGuard } from 'src/core/auth/guards/jwt-auth.guard';
import { Roles } from 'src/core/auth/decorators/role.decorator';

@Controller('developer')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DeveloperController {
  @Get('dashboard')
  @Roles(RoleEnum.DEVELOPER, RoleEnum.ADMIN)
  getDeveloperDashboard() {
    return { message: 'Welcome Developer!' };
  }
}
