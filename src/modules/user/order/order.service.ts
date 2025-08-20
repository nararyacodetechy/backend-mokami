import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Orders } from './entity/order.entity';
import { Features } from './entity/features.entity';
import { Requirements } from './entity/requirements.entity';
import { Tasks } from './entity/tasks.entity';
import { PricingProposals } from './entity/pricing-proposals.entity';
import { Onboardings } from './entity/onboardings.entity';
import { OnboardingMeetings } from './entity/onboarding-meetings.entity';
import { Users } from 'src/core/users/entity/users.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class OrderService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(Orders)
    private readonly orderRepository: Repository<Orders>,
    @InjectRepository(Features)
    private readonly featuresRepository: Repository<Features>,
    @InjectRepository(Requirements)
    private readonly requirementsRepository: Repository<Requirements>,
    @InjectRepository(Tasks)
    private readonly tasksRepository: Repository<Tasks>,
    @InjectRepository(PricingProposals)
    private readonly pricingProposalsRepository: Repository<PricingProposals>,
    @InjectRepository(Onboardings)
    private readonly onboardingsRepository: Repository<Onboardings>,
    @InjectRepository(OnboardingMeetings)
    private readonly onboardingMeetingsRepository: Repository<OnboardingMeetings>,
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
  ) {}

  async createOrder(userId: string, role: string, dto: CreateOrderDto) {
    if (role !== 'user') {
      throw new UnauthorizedException('Only users can create orders');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const user = await queryRunner.manager.findOne(Users, {
        where: { id: userId },
        relations: ['profile'],
      });
      if (!user) throw new NotFoundException('User not found');

      const orderNumber = `ORD-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

      const order = queryRunner.manager.create(Orders, {
        id: uuidv4(),
        clientId: userId,
        client: user,
        orderName: dto.orderName,
        orderNumber,
        projectType: dto.projectType,
        projectDetail: dto.projectDetail,
        reference: dto.reference,
        image: dto.image,
        imgIdOrder: dto.imgIdOrder,
        status: dto.status,
        paymentMethod: dto.paymentMethod,
        paymentProof: dto.paymentProof,
        budgetPrice: dto.budgetPrice,
        designPreferenceColor: dto.designPreferenceColor,
        designPreferenceStyle: dto.designPreferenceStyle,
        totalPriceFeatures: dto.totalPriceFeatures,
        totalPriceFinal: dto.totalPriceFinal,
        pricingStatus: dto.pricingStatus,
        paymentTerms: dto.paymentTerms,
        paymentStatus: dto.paymentStatus,
      });

      const savedOrder = await queryRunner.manager.save(Orders, order);

      // Create features
      for (const featureDto of dto.features) {
        const feature = queryRunner.manager.create(Features, {
          id: uuidv4(),
          orderId: savedOrder.id,
          order: savedOrder,
          name: featureDto.name,
          function: featureDto.function,
          price: featureDto.price,
          duration: featureDto.duration,
          approvalStatus: featureDto.approvalStatus,
          deletionRequest: featureDto.deletionRequest ?? false,
          isMarkedForDiscussion: featureDto.isMarkedForDiscussion ?? false,
          discussionNote: featureDto.discussionNote,
          discussionStatus: featureDto.discussionStatus,
        });
        const savedFeature = await queryRunner.manager.save(Features, feature);

        // Create requirements
        const requirements = featureDto.requirements.map((req) =>
          queryRunner.manager.create(Requirements, {
            id: uuidv4(),
            featureId: savedFeature.id,
            feature: savedFeature,
            title: req.title,
            status: req.status,
          }),
        );
        await queryRunner.manager.save(Requirements, requirements);

        // Create tasks
        const tasks = featureDto.tasks.map((task) =>
          queryRunner.manager.create(Tasks, {
            id: uuidv4(),
            featureId: savedFeature.id,
            feature: savedFeature,
            title: task.title,
            status: task.status,
            deadline: task.deadline,
          }),
        );
        await queryRunner.manager.save(Tasks, tasks);
      }

      // Create pricing proposals
      const proposals = dto.pricingProposals.map((prop) =>
        queryRunner.manager.create(PricingProposals, {
          id: uuidv4(),
          orderId: savedOrder.id,
          order: savedOrder,
          amount: prop.amount,
          discount: prop.discount,
          taxRate: prop.taxRate,
          commissionRate: prop.commissionRate,
          notes: prop.notes,
          proposedBy: prop.proposedBy,
        }),
      );
      await queryRunner.manager.save(PricingProposals, proposals);

      // Create onboarding
      const onboarding = queryRunner.manager.create(Onboardings, {
        id: uuidv4(),
        orderId: savedOrder.id,
        order: savedOrder,
        status: dto.onboarding.status,
        analysisNotes: dto.onboarding.analysisNotes,
      });
      const savedOnboarding = await queryRunner.manager.save(Onboardings, onboarding);

      // Create onboarding meetings
      const meetings = dto.onboarding.meetings.map((meet) =>
        queryRunner.manager.create(OnboardingMeetings, {
          id: uuidv4(),
          onboardingId: savedOnboarding.id,
          onboarding: savedOnboarding,
          date: meet.date,
          time: meet.time,
          link: meet.link,
          notes: meet.notes,
        }),
      );
      await queryRunner.manager.save(OnboardingMeetings, meetings);

      await queryRunner.commitTransaction();

      return {
        status: 'success',
        message: 'Order created successfully',
        data: await this.getOrderDetails(savedOrder.id, userId, role),
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async getUserOrders(userId: string, role: string) {
    let orders;
    if (role === 'product-manager') {
      orders = await this.orderRepository.find({
        relations: [
          'client',
          'client.profile',
          'features',
          'features.requirements',
          'features.tasks',
          'pricingProposals',
          'onboarding',
          'onboarding.meetings',
        ],
      });
    } else if (role === 'user') {
      orders = await this.orderRepository.find({
        where: { clientId: userId },
        relations: [
          'client',
          'client.profile',
          'features',
          'features.requirements',
          'features.tasks',
          'pricingProposals',
          'onboarding',
          'onboarding.meetings',
        ],
      });
    } else {
      throw new UnauthorizedException('Invalid role');
    }

    return {
      status: 'success',
      message: 'Orders retrieved successfully',
      data: orders.map((order) => this.mapOrderToResponse(order)),
    };
  }

  async getOrderDetails(orderId: string, userId: string, role: string) {
    let order;
    if (role === 'product-manager') {
      order = await this.orderRepository.findOne({
        where: { id: orderId },
        relations: [
          'client',
          'client.profile',
          'features',
          'features.requirements',
          'features.tasks',
          'pricingProposals',
          'onboarding',
          'onboarding.meetings',
        ],
      });
    } else if (role === 'user') {
      order = await this.orderRepository.findOne({
        where: { id: orderId, clientId: userId },
        relations: [
          'client',
          'client.profile',
          'features',
          'features.requirements',
          'features.tasks',
          'pricingProposals',
          'onboarding',
          'onboarding.meetings',
        ],
      });
    } else {
      throw new UnauthorizedException('Invalid role');
    }

    if (!order) throw new NotFoundException('Order not found or not authorized');

    return this.mapOrderToResponse(order);
  }

  async getAllOrders() {
    const orders = await this.orderRepository.find({
      relations: [
        'client',
        'client.profile',
        'features',
        'features.requirements',
        'features.tasks',
        'pricingProposals',
        'onboarding',
        'onboarding.meetings',
      ],
    });

    return {
      status: 'success',
      message: 'All orders retrieved successfully',
      data: orders.map((order) => this.mapOrderToResponse(order)),
    };
  }

  private mapOrderToResponse(order: Orders) {
    return {
      orderId: order.id,
      clientId: order.clientId,
      clientName: order.client.profile?.fullName ?? null,
      username: order.client.profile?.username ?? null,
      nik: order.client.profile?.nik ?? null,
      email: order.client.email,
      address: order.client.profile?.address ?? null,
      phone: order.client.profile?.phone ?? null,
      company: order.client.profile?.company ?? null,
      imageProfile: order.client.profile?.imageProfile ?? null,
      orderName: order.orderName,
      orderNumber: order.orderNumber,
      projectType: order.projectType,
      projectDetail: order.projectDetail,
      reference: order.reference,
      image: order.image,
      imgIdOrder: order.imgIdOrder,
      status: order.status,
      paymentMethod: order.paymentMethod,
      paymentProof: order.paymentProof,
      budgetPrice: order.budgetPrice,
      designPreference: {
        color: order.designPreferenceColor,
        style: order.designPreferenceStyle,
      },
      totalPriceFeatures: order.totalPriceFeatures,
      totalPriceFinal: order.totalPriceFinal,
      pricingStatus: order.pricingStatus,
      paymentTerms: order.paymentTerms,
      paymentStatus: order.paymentStatus,
      features: order.features.map((feature) => ({
        name: feature.name,
        function: feature.function,
        price: feature.price,
        duration: feature.duration,
        approvalStatus: feature.approvalStatus,
        deletionRequest: feature.deletionRequest,
        isMarkedForDiscussion: feature.isMarkedForDiscussion,
        discussionNote: feature.discussionNote,
        discussionStatus: feature.discussionStatus,
        requirements: feature.requirements,
        tasks: feature.tasks,
      })),
      pricingProposals: order.pricingProposals || [],
      onboarding: order.onboarding
        ? {
            status: order.onboarding.status,
            analysisNotes: order.onboarding.analysisNotes,
            meetings: order.onboarding.meetings || [],
          }
        : null,
    };
  }
}