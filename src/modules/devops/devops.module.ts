import { forwardRef, Module } from '@nestjs/common';
import { DevopsService } from './devops.service';
import { DevopsController } from './devops.controller';
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
  providers: [DevopsService],
  controllers: [DevopsController]
})
export class DevopsModule {}
