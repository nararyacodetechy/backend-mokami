import { forwardRef, Module } from '@nestjs/common';
import { DeveloperService } from './developer.service';
import { DeveloperController } from './developer.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/core/users/entity/users.entity';
import { Roles } from 'src/core/role/entity/roles.entity';
import { UserRoles } from 'src/core/role/entity/user-roles.entity';
import { OrderModule } from '../user/order/order.module';
import { AuthModule } from 'src/core/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Users, Roles, UserRoles]),
    OrderModule,
    forwardRef(() => AuthModule), // Use forwardRef Import AuthModule to provide JwtService and repositories
  ],
  providers: [DeveloperService],
  controllers: [DeveloperController]
})
export class DeveloperModule {}
