import { forwardRef, Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { DeveloperModule } from '../developer/developer.module';
import { DesignerModule } from '../designer/designer.module';
import { AuthModule } from 'src/core/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderModule } from '../user/order/order.module';
import { Users } from 'src/core/users/entity/users.entity';
import { UserRoles } from 'src/core/role/entity/user-roles.entity';
import { Roles } from 'src/core/role/entity/roles.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Users, Roles, UserRoles]),
    OrderModule,
    forwardRef(() => AuthModule), // Use forwardRef Import AuthModule to provide JwtService and repositories
    AdminModule,
    DeveloperModule,
    DesignerModule,
  ],
  controllers: [AdminController],
  providers: [AdminService]
})
export class AdminModule {}
