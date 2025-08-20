import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { Orders } from './entity/order.entity';
import { Features } from './entity/features.entity';
import { Requirements } from './entity/requirements.entity';
import { Tasks } from './entity/tasks.entity';
import { PricingProposals } from './entity/pricing-proposals.entity';
import { Onboardings } from './entity/onboardings.entity';
import { OnboardingMeetings } from './entity/onboarding-meetings.entity';
import { Users } from 'src/core/users/entity/users.entity';
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
      Roles, // Add Roles for RolesRepository
    ]),
    forwardRef(() => AuthModule), // Import AuthModule for JwtService and guards
  ],
  providers: [OrderService],
  controllers: [OrderController],
})
export class OrderModule {}