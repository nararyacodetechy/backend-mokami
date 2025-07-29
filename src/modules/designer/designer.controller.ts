import { Controller, Get, UseGuards } from '@nestjs/common';
import { Roles } from 'src/core/auth/decorators/role.decorator';
import { JwtAuthGuard } from 'src/core/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/core/auth/guards/roles.guard';
import { RoleEnum } from 'src/core/role/enum/role.enum';

@Controller('designer')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DesignerController {
  @Get('dashboard')
  @Roles(RoleEnum.DESIGNER, RoleEnum.ADMIN)
  getDesignerDashboard() {
    return { message: 'Welcome Designer Dashboard!' };
  }
}
