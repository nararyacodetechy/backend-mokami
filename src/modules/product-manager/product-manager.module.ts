import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductManagerService } from './product-manager.service';
import { ProductManagerController } from './product-manager.controller';
import { Order } from './entities/order.entity';
import { Feature } from './entities/feature.entity';
import { Requirement } from './entities/requirement.entity';
import { PricingProposal } from './entities/pricing-proposal.entity';
import { Onboarding } from './entities/onboarding.entity';
import { OnboardingMeeting } from './entities/onboarding-meeting.entity';
import { Task } from './entities/task.entity';
import { Users } from 'src/core/users/entity/users.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, Feature, Requirement, PricingProposal, Onboarding, OnboardingMeeting, Task, Users]),
  ],
  providers: [ProductManagerService],
  controllers: [ProductManagerController],
})
export class ProductManagerModule {}