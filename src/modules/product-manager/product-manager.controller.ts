import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { ProductManagerService } from './product-manager.service';
import { CreateOrderDto, CreateFeatureDto, CreateRequirementDto } from './dto/create-order.dto';
import { Roles } from 'src/core/auth/decorators/role.decorator';
import { JwtAuthGuard } from 'src/core/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/core/auth/guards/roles.guard';
import { RoleEnum } from 'src/core/role/enum/role.enum';
import { UpdateOrderDto } from './dto/update-order.dto';

@Controller('product-manager')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(RoleEnum.PRODUCT_MANAGER, RoleEnum.ADMIN)
export class ProductManagerController {
  constructor(private readonly productManagerService: ProductManagerService) {}

  @Get('orders')
  getOrders() {
    return this.productManagerService.getOrders();
  }

  @Get('orders/:id')
  getOrderById(@Param('id') id: string) {
    return this.productManagerService.getOrderById(id);
  }

  @Post('orders')
  createOrder(@Body() createOrderDto: CreateOrderDto) {
    return this.productManagerService.createOrder(createOrderDto);
  }

  @Put('orders/:id')
  updateOrder(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.productManagerService.updateOrder(id, updateOrderDto);
  }

  @Delete('orders/:id')
  deleteOrder(@Param('id') id: string) {
    return this.productManagerService.deleteOrder(id);
  }

  @Post('orders/:orderId/features')
  addFeature(@Param('orderId') orderId: string, @Body() featureDto: CreateFeatureDto) {
    return this.productManagerService.addFeature(orderId, featureDto);
  }

  @Put('features/:featureId')
  updateFeature(@Param('featureId') featureId: string, @Body() featureDto: CreateFeatureDto) {
    return this.productManagerService.updateFeature(featureId, featureDto);
  }

  @Delete('features/:featureId')
  deleteFeature(@Param('featureId') featureId: string) {
    return this.productManagerService.deleteFeature(featureId);
  }

  @Post('features/:featureId/requirements')
  addRequirement(@Param('featureId') featureId: string, @Body() requirementDto: CreateRequirementDto) {
    return this.productManagerService.addRequirement(featureId, requirementDto);
  }

  @Put('requirements/:requirementId')
  updateRequirement(@Param('requirementId') requirementId: string, @Body() requirementDto: CreateRequirementDto) {
    return this.productManagerService.updateRequirement(requirementId, requirementDto);
  }

  @Delete('requirements/:requirementId')
  deleteRequirement(@Param('requirementId') requirementId: string) {
    return this.productManagerService.deleteRequirement(requirementId);
  }
}