import { Controller, Get, Param, Request, UseGuards } from '@nestjs/common';
import { Roles } from 'src/core/auth/decorators/role.decorator';
import { JwtAuthGuard } from 'src/core/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/core/auth/guards/roles.guard';
import { RoleEnum } from 'src/core/role/enum/role.enum';
import { OrderService } from 'src/modules/user/order/order.service';

@Controller('product-manager/orders')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProductManagerOrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get('list')
  @Roles(RoleEnum.PRODUCT_MANAGER)
  getAllOrders(@Request() req) {
    const userId = req.user.sub;
    const role = req.user.activeRole.name || req.user.activeRole;
    return this.orderService.getUserOrders(userId, role);
  }

  @Get(':orderId')
  @Roles(RoleEnum.PRODUCT_MANAGER)
  getOrderDetails(@Request() req, @Param('orderId') orderId: string) {
    const userId = req.user.sub;
    const role = req.user.activeRole.name || req.user.activeRole;
    return this.orderService.getOrderDetails(orderId, userId, role);
  }
}