import { Module } from '@nestjs/common';
import { ProductManagerService } from './product-manager.service';
import { ProductManagerController } from './product-manager.controller';

@Module({
  providers: [ProductManagerService],
  controllers: [ProductManagerController]
})
export class ProductManagerModule {}
