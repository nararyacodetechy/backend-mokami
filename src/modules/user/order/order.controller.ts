import { Body, Controller, Get, Param, Post, Request, UseGuards } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { JwtAuthGuard } from 'src/core/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/core/auth/guards/roles.guard';
import { RoleEnum } from 'src/core/role/enum/role.enum';
import { Roles } from 'src/core/auth/decorators/role.decorator';

@Controller('orders')
@UseGuards(JwtAuthGuard, RolesGuard)
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('create')
  @Roles(RoleEnum.USER)
  createOrder(@Request() req, @Body() createOrderDto: CreateOrderDto) {
    const userId = req.user.sub;
    const role = req.user.activeRole.name || req.user.activeRole;
    return this.orderService.createOrder(userId, role, createOrderDto);
  }

  @Get('list')
  @Roles(RoleEnum.USER, RoleEnum.PRODUCT_MANAGER)
  getUserOrders(@Request() req) {
    const userId = req.user.sub;
    const role = req.user.activeRole.name || req.user.activeRole;
    return this.orderService.getUserOrders(userId, role);
  }

  @Get(':orderId')
  @Roles(RoleEnum.USER, RoleEnum.PRODUCT_MANAGER)
  getOrderDetails(@Request() req, @Param('orderId') orderId: string) {
    const userId = req.user.sub;
    const role = req.user.activeRole.name || req.user.activeRole;
    return this.orderService.getOrderDetails(orderId, userId, role);
  }
}