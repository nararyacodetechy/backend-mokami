import { Controller, Get, UseGuards } from '@nestjs/common';
import { Roles } from 'src/core/auth/decorators/role.decorator';
import { JwtAuthGuard } from 'src/core/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/core/auth/guards/roles.guard';
import { RoleEnum } from 'src/core/role/enum/role.enum';

@Controller('product-manager')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProductManagerController {
  @Get('dashboard')
  @Roles(RoleEnum.PRODUCT_MANAGER, RoleEnum.ADMIN)
  getProductManagerDashboard() {
    return { message: 'Welcome Product Manager Dashboard!' };
  }
}
