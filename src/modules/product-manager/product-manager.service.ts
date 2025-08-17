import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Order } from './entities/order.entity';
import { Feature } from './entities/feature.entity';
import { Requirement } from './entities/requirement.entity';
import { PricingProposal } from './entities/pricing-proposal.entity';
import { Onboarding } from './entities/onboarding.entity';
import { OnboardingMeeting } from './entities/onboarding-meeting.entity';
import { Task } from './entities/task.entity';
import { CreateFeatureDto, CreateOrderDto, CreateRequirementDto } from './dto/create-order.dto';
import { Users } from 'src/core/users/entity/users.entity';
import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class ProductManagerService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(Feature)
    private readonly featureRepository: Repository<Feature>,
    @InjectRepository(Requirement)
    private readonly requirementRepository: Repository<Requirement>,
    @InjectRepository(PricingProposal)
    private readonly pricingProposalRepository: Repository<PricingProposal>,
    @InjectRepository(Onboarding)
    private readonly onboardingRepository: Repository<Onboarding>,
    @InjectRepository(OnboardingMeeting)
    private readonly onboardingMeetingRepository: Repository<OnboardingMeeting>,
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
    @InjectRepository(Users)
    private readonly userRepository: Repository<Users>,
  ) {}

  async createOrder(dto: CreateOrderDto) {
    const client = await this.userRepository.findOne({ where: { id: dto.clientId } });
    if (!client) throw new NotFoundException('Client not found');

    const order = this.orderRepository.create({
      id: uuidv4(),
      clientName: dto.clientName,
      client,
      username: dto.username,
      nik: dto.nik,
      email: dto.email,
      address: dto.address,
      phone: dto.phone,
      company: dto.company,
      imageProfile: dto.imageProfile,
      orderName: dto.orderName,
      orderNumber: dto.orderNumber,
      projectType: dto.projectType,
      projectDetail: dto.projectDetail,
      reference: dto.reference,
      image: dto.image,
      imgIdOrder: dto.imgIdOrder,
      status: dto.status,
      paymentMethod: dto.paymentMethod,
      paymentProof: dto.paymentProof,
      budgetPrice: dto.budgetPrice,
      designPreferenceColor: dto.designPreference?.color,
      designPreferenceStyle: dto.designPreference?.style,
      totalPriceFeatures: dto.totalPriceFeatures,
      totalPriceFinal: dto.totalPriceFinal,
      pricingStatus: dto.pricingStatus,
      paymentTerms: dto.paymentTerms,
      paymentStatus: dto.paymentStatus,
    });

    const savedOrder = await this.orderRepository.save(order);

    if (dto.features) {
      const features = dto.features.map((featureDto) => ({
        id: uuidv4(),
        order: savedOrder,
        name: featureDto.name,
        function: featureDto.function,
        price: featureDto.price,
        duration: featureDto.duration,
        approvalStatus: featureDto.approvalStatus,
        isMarkedForDiscussion: featureDto.isMarkedForDiscussion || false,
        discussionNote: featureDto.discussionNote,
        discussionStatus: featureDto.discussionStatus,
        requirements: featureDto.requirements?.map((req) => ({
          id: uuidv4(),
          title: req.title,
          status: req.status,
        })),
        tasks: featureDto.tasks?.map((task) => ({
          id: uuidv4(),
          title: task.title,
          status: task.status,
        })),
      }));

      for (const feature of features) {
        const savedFeature = await this.featureRepository.save(feature);
        if (feature.requirements) {
          for (const req of feature.requirements) {
            await this.requirementRepository.save({ ...req, feature: savedFeature });
          }
        }
        if (feature.tasks) {
          for (const task of feature.tasks) {
            await this.taskRepository.save({ ...task, feature: savedFeature });
          }
        }
      }
    }

    if (dto.pricingProposals) {
      const pricingProposals = dto.pricingProposals.map((proposal) => ({
        id: uuidv4(),
        order: savedOrder,
        amount: proposal.amount,
        discount: proposal.discount,
        taxRate: proposal.taxRate,
        commissionRate: proposal.commissionRate,
        notes: proposal.notes,
        proposedBy: proposal.proposedBy,
      }));
      await this.pricingProposalRepository.save(pricingProposals);
    }

    if (dto.onboarding) {
      const onboarding = this.onboardingRepository.create({
        id: uuidv4(),
        order: savedOrder,
        status: dto.onboarding.status,
        analysisNotes: dto.onboarding.analysisNotes,
      });
      const savedOnboarding = await this.onboardingRepository.save(onboarding);
      if (dto.onboarding.meetings) {
        const meetings = dto.onboarding.meetings.map((meeting) => ({
          id: uuidv4(),
          onboarding: savedOnboarding,
          date: meeting.date,
          time: meeting.time,
          link: meeting.link,
          notes: meeting.notes,
        }));
        await this.onboardingMeetingRepository.save(meetings);
      }
    }

    return {
      status: 'success',
      message: 'Order created successfully',
      order: await this.orderRepository.findOne({
        where: { id: savedOrder.id },
        relations: ['client', 'features', 'features.requirements', 'features.tasks', 'pricingProposals', 'onboardings', 'onboardings.meetings'],
      }),
    };
  }

  async getOrders() {
    return this.orderRepository.find({
      relations: ['client', 'features', 'features.requirements', 'features.tasks', 'pricingProposals', 'onboardings', 'onboardings.meetings'],
    });
  }

  async getOrderById(id: string) {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['client', 'features', 'features.requirements', 'features.tasks', 'pricingProposals', 'onboardings', 'onboardings.meetings'],
    });
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  async updateOrder(id: string, dto: UpdateOrderDto) {
    const order = await this.orderRepository.findOne({ where: { id } });
    if (!order) throw new NotFoundException('Order not found');

    Object.assign(order, {
      clientName: dto.clientName ?? order.clientName,
      username: dto.username ?? order.username,
      nik: dto.nik ?? order.nik,
      email: dto.email ?? order.email,
      address: dto.address ?? order.address,
      phone: dto.phone ?? order.phone,
      company: dto.company ?? order.company,
      imageProfile: dto.imageProfile ?? order.imageProfile,
      orderName: dto.orderName ?? order.orderName,
      orderNumber: dto.orderNumber ?? order.orderNumber,
      projectType: dto.projectType ?? order.projectType,
      projectDetail: dto.projectDetail ?? order.projectDetail,
      reference: dto.reference ?? order.reference,
      image: dto.image ?? order.image,
      imgIdOrder: dto.imgIdOrder ?? order.imgIdOrder,
      status: dto.status ?? order.status,
      paymentMethod: dto.paymentMethod ?? order.paymentMethod,
      paymentProof: dto.paymentProof ?? order.paymentProof,
      budgetPrice: dto.budgetPrice ?? order.budgetPrice,
      designPreferenceColor: dto.designPreference?.color ?? order.designPreferenceColor,
      designPreferenceStyle: dto.designPreference?.style ?? order.designPreferenceStyle,
      totalPriceFeatures: dto.totalPriceFeatures ?? order.totalPriceFeatures,
      totalPriceFinal: dto.totalPriceFinal ?? order.totalPriceFinal,
      pricingStatus: dto.pricingStatus ?? order.pricingStatus,
      paymentTerms: dto.paymentTerms ?? order.paymentTerms,
      paymentStatus: dto.paymentStatus ?? order.paymentStatus,
    });

    if (dto.clientId && dto.clientId !== order.client.id) {
      const client = await this.userRepository.findOne({ where: { id: dto.clientId } });
      if (!client) throw new NotFoundException('Client not found');
      order.client = client;
    }

    const savedOrder = await this.orderRepository.save(order);

    if (dto.features) {
      await this.featureRepository.delete({ order: { id } });
      const features = dto.features.map((featureDto) => ({
        id: uuidv4(),
        order: savedOrder,
        name: featureDto.name,
        function: featureDto.function,
        price: featureDto.price,
        duration: featureDto.duration,
        approvalStatus: featureDto.approvalStatus,
        isMarkedForDiscussion: featureDto.isMarkedForDiscussion || false,
        discussionNote: featureDto.discussionNote,
        discussionStatus: featureDto.discussionStatus,
        requirements: featureDto.requirements?.map((req) => ({
          id: uuidv4(),
          title: req.title,
          status: req.status,
        })),
        tasks: featureDto.tasks?.map((task) => ({
          id: uuidv4(),
          title: task.title,
          status: task.status,
        })),
      }));

      for (const feature of features) {
        const savedFeature = await this.featureRepository.save(feature);
        if (feature.requirements) {
          for (const req of feature.requirements) {
            await this.requirementRepository.save({ ...req, feature: savedFeature });
          }
        }
        if (feature.tasks) {
          for (const task of feature.tasks) {
            await this.taskRepository.save({ ...task, feature: savedFeature });
          }
        }
      }
    }

    if (dto.pricingProposals) {
      await this.pricingProposalRepository.delete({ order: { id } });
      const pricingProposals = dto.pricingProposals.map((proposal) => ({
        id: uuidv4(),
        order: savedOrder,
        amount: proposal.amount,
        discount: proposal.discount,
        taxRate: proposal.taxRate,
        commissionRate: proposal.commissionRate,
        notes: proposal.notes,
        proposedBy: proposal.proposedBy,
      }));
      await this.pricingProposalRepository.save(pricingProposals);
    }

    if (dto.onboarding) {
      await this.onboardingRepository.delete({ order: { id } });
      const onboarding = this.onboardingRepository.create({
        id: uuidv4(),
        order: savedOrder,
        status: dto.onboarding.status,
        analysisNotes: dto.onboarding.analysisNotes,
      });
      const savedOnboarding = await this.onboardingRepository.save(onboarding);
      if (dto.onboarding.meetings) {
        await this.onboardingMeetingRepository.delete({ onboarding: { id: savedOnboarding.id } });
        const meetings = dto.onboarding.meetings.map((meeting) => ({
          id: uuidv4(),
          onboarding: savedOnboarding,
          date: meeting.date,
          time: meeting.time,
          link: meeting.link,
          notes: meeting.notes,
        }));
        await this.onboardingMeetingRepository.save(meetings);
      }
    }

    return {
      status: 'success',
      message: 'Order updated successfully',
      order: await this.orderRepository.findOne({
        where: { id: savedOrder.id },
        relations: ['client', 'features', 'features.requirements', 'features.tasks', 'pricingProposals', 'onboardings', 'onboardings.meetings'],
      }),
    };
  }

  async deleteOrder(id: string) {
    const order = await this.orderRepository.findOne({ where: { id } });
    if (!order) throw new NotFoundException('Order not found');
    await this.orderRepository.delete(id);
    return { status: 'success', message: 'Order deleted successfully' };
  }

  async addFeature(orderId: string, featureDto: CreateFeatureDto) {
    const order = await this.orderRepository.findOne({ where: { id: orderId } });
    if (!order) throw new NotFoundException('Order not found');

    const feature = this.featureRepository.create({
      id: uuidv4(),
      order,
      name: featureDto.name,
      function: featureDto.function,
      price: featureDto.price,
      duration: featureDto.duration,
      approvalStatus: featureDto.approvalStatus,
      isMarkedForDiscussion: featureDto.isMarkedForDiscussion || false,
      discussionNote: featureDto.discussionNote,
      discussionStatus: featureDto.discussionStatus,
    });

    const savedFeature = await this.featureRepository.save(feature);

    if (featureDto.requirements) {
      const requirements = featureDto.requirements.map((req) => ({
        id: uuidv4(),
        feature: savedFeature,
        title: req.title,
        status: req.status,
      }));
      await this.requirementRepository.save(requirements);
    }

    if (featureDto.tasks) {
      const tasks = featureDto.tasks.map((task) => ({
        id: uuidv4(),
        feature: savedFeature,
        title: task.title,
        status: task.status,
      }));
      await this.taskRepository.save(tasks);
    }

    return {
      status: 'success',
      message: 'Feature added successfully',
      feature: await this.featureRepository.findOne({
        where: { id: savedFeature.id },
        relations: ['order', 'requirements', 'tasks'],
      }),
    };
  }

  async updateFeature(featureId: string, featureDto: CreateFeatureDto) {
    const feature = await this.featureRepository.findOne({ where: { id: featureId } });
    if (!feature) throw new NotFoundException('Feature not found');

    Object.assign(feature, {
      name: featureDto.name,
      function: featureDto.function,
      price: featureDto.price,
      duration: featureDto.duration,
      approvalStatus: featureDto.approvalStatus,
      isMarkedForDiscussion: featureDto.isMarkedForDiscussion || false,
      discussionNote: featureDto.discussionNote,
      discussionStatus: featureDto.discussionStatus,
    });

    const savedFeature = await this.featureRepository.save(feature);

    if (featureDto.requirements) {
      await this.requirementRepository.delete({ feature: { id: featureId } });
      const requirements = featureDto.requirements.map((req) => ({
        id: uuidv4(),
        feature: savedFeature,
        title: req.title,
        status: req.status,
      }));
      await this.requirementRepository.save(requirements);
    }

    if (featureDto.tasks) {
      await this.taskRepository.delete({ feature: { id: featureId } });
      const tasks = featureDto.tasks.map((task) => ({
        id: uuidv4(),
        feature: savedFeature,
        title: task.title,
        status: task.status,
      }));
      await this.taskRepository.save(tasks);
    }

    return {
      status: 'success',
      message: 'Feature updated successfully',
      feature: await this.featureRepository.findOne({
        where: { id: savedFeature.id },
        relations: ['order', 'requirements', 'tasks'],
      }),
    };
  }

  async deleteFeature(featureId: string) {
    const feature = await this.featureRepository.findOne({ where: { id: featureId } });
    if (!feature) throw new NotFoundException('Feature not found');
    await this.featureRepository.delete(featureId);
    return { status: 'success', message: 'Feature deleted successfully' };
  }

  async addRequirement(featureId: string, requirementDto: CreateRequirementDto) {
    const feature = await this.featureRepository.findOne({ where: { id: featureId } });
    if (!feature) throw new NotFoundException('Feature not found');

    const requirement = this.requirementRepository.create({
      id: uuidv4(),
      feature,
      title: requirementDto.title,
      status: requirementDto.status,
    });

    const savedRequirement = await this.requirementRepository.save(requirement);
    return {
      status: 'success',
      message: 'Requirement added successfully',
      requirement: savedRequirement,
    };
  }

  async updateRequirement(requirementId: string, requirementDto: CreateRequirementDto) {
    const requirement = await this.requirementRepository.findOne({ where: { id: requirementId } });
    if (!requirement) throw new NotFoundException('Requirement not found');

    Object.assign(requirement, {
      title: requirementDto.title,
      status: requirementDto.status,
    });

    const savedRequirement = await this.requirementRepository.save(requirement);
    return {
      status: 'success',
      message: 'Requirement updated successfully',
      requirement: savedRequirement,
    };
  }

  async deleteRequirement(requirementId: string) {
    const requirement = await this.requirementRepository.findOne({ where: { id: requirementId } });
    if (!requirement) throw new NotFoundException('Requirement not found');
    await this.requirementRepository.delete(requirementId);
    return { status: 'success', message: 'Requirement deleted successfully' };
  }
}