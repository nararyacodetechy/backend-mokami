import { Module } from '@nestjs/common';
import { DesignerService } from './designer.service';
import { DesignerController } from './designer.controller';

@Module({
  providers: [DesignerService],
  controllers: [DesignerController]
})
export class DesignerModule {}
