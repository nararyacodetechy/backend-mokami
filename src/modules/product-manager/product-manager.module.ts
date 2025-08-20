import { forwardRef, Module } from '@nestjs/common';
import { OrderService } from '../user/order/order.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Orders } from '../user/order/entity/order.entity';
import { Features } from '../user/order/entity/features.entity';
import { Requirements } from '../user/order/entity/requirements.entity';
import { Tasks } from '../user/order/entity/tasks.entity';
import { PricingProposals } from '../user/order/entity/pricing-proposals.entity';
import { Onboardings } from '../user/order/entity/onboardings.entity';
import { OnboardingMeetings } from '../user/order/entity/onboarding-meetings.entity';
import { Users } from 'src/core/users/entity/users.entity';
import { ProductManagerOrderController } from './order/order.controller';
import { OrderModule } from '../user/order/order.module';
import { AuthModule } from 'src/core/auth/auth.module';
import { Roles } from 'src/core/role/entity/roles.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Orders,
      Features,
      Requirements,
      Tasks,
      PricingProposals,
      Onboardings,
      OnboardingMeetings,
      Users,
      Roles, // Add Roles for consistency
    ]),
    forwardRef(() => AuthModule), // Use forwardRef
  ],
  controllers: [ProductManagerOrderController],
  providers: [OrderService],
})
export class ProductManagerModule {}