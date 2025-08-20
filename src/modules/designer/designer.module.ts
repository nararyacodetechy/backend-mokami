import { forwardRef, Module } from '@nestjs/common';
import { DesignerService } from './designer.service';
import { DesignerController } from './designer.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderModule } from '../user/order/order.module';
import { AuthModule } from 'src/core/auth/auth.module';
import { Users } from 'src/core/users/entity/users.entity';
import { Roles } from 'src/core/role/entity/roles.entity';
import { UserRoles } from 'src/core/role/entity/user-roles.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Users, Roles, UserRoles]),
    OrderModule,
    forwardRef(() => AuthModule), // Use forwardRef Import AuthModule to provide JwtService and repositories
  ],
  controllers: [DesignerController],
  providers: [DesignerService],
})
export class DesignerModule {}
