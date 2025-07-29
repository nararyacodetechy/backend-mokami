import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { DeveloperModule } from '../developer/developer.module';
import { DesignerModule } from '../designer/designer.module';

@Module({
  imports: [
    AdminModule,
    DeveloperModule,
    DesignerModule,
  ],
  controllers: [AdminController],
  providers: [AdminService]
})
export class AdminModule {}
