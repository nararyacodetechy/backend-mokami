import { Type } from 'class-transformer';
import { IsArray, IsDecimal, IsEnum, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';

class CreateFeatureDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  function: string;

  @IsNotEmpty()
  @IsDecimal()
  price: number;

  @IsNotEmpty()
  @IsString()
  duration: string;

  @IsNotEmpty()
  @IsEnum(['draft', 'waiting', 'approved'])
  approvalStatus: string;

  @IsOptional()
  deletionRequest?: boolean;

  @IsOptional()
  isMarkedForDiscussion?: boolean;

  @IsOptional()
  @IsString()
  discussionNote?: string;

  @IsNotEmpty()
  @IsEnum(['open', 'close'])
  discussionStatus: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateRequirementDto)
  requirements: CreateRequirementDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateTaskDto)
  tasks: CreateTaskDto[];
}

class CreateRequirementDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsEnum(['pending', 'approved'])
  status?: string;
}

class CreateTaskDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsEnum(['todo', 'in-progress', 'done'])
  status: string;

  @IsOptional()
  deadline?: Date;
}

class CreatePricingProposalDto {
  @IsNotEmpty()
  @IsDecimal()
  amount: number;

  @IsNotEmpty()
  @IsDecimal()
  discount: number;

  @IsNotEmpty()
  @IsDecimal()
  taxRate: number;

  @IsNotEmpty()
  @IsDecimal()
  commissionRate: number;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsNotEmpty()
  @IsEnum(['PM', 'Client'])
  proposedBy: string;
}

class CreateOnboardingMeetingDto {
  @IsNotEmpty()
  @IsString()
  date: string;

  @IsNotEmpty()
  @IsString()
  time: string;

  @IsOptional()
  @IsString()
  link?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}

class CreateOnboardingDto {
  @IsNotEmpty()
  @IsEnum(['initial', 'in-progress', 'completed'])
  status: string;

  @IsOptional()
  @IsString()
  analysisNotes?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOnboardingMeetingDto)
  meetings: CreateOnboardingMeetingDto[];
}

export class CreateOrderDto {
  @IsNotEmpty()
  @IsString()
  orderName: string;

  @IsNotEmpty()
  @IsString()
  projectType: string;

  @IsNotEmpty()
  @IsString()
  projectDetail: string;

  @IsOptional()
  @IsString()
  reference?: string;

  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  @IsString()
  imgIdOrder?: string;

  @IsNotEmpty()
  @IsEnum(['under-review', 'waiting', 'analysis-finished', 'completed'])
  status: string;

  @IsOptional()
  @IsString()
  paymentMethod?: string;

  @IsOptional()
  @IsString()
  paymentProof?: string;

  @IsOptional()
  @IsDecimal()
  budgetPrice?: number;

  @IsOptional()
  @IsString()
  designPreferenceColor?: string;

  @IsOptional()
  @IsString()
  designPreferenceStyle?: string;

  @IsOptional()
  @IsDecimal()
  totalPriceFeatures?: number;

  @IsOptional()
  @IsDecimal()
  totalPriceFinal?: number;

  @IsOptional()
  @IsEnum(['negotiating', 'confirmed'])
  pricingStatus?: string;

  @IsOptional()
  @IsEnum(['full', 'installments', 'milestones'])
  paymentTerms?: string;

  @IsOptional()
  @IsEnum(['pending', 'paid'])
  paymentStatus?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateFeatureDto)
  features: CreateFeatureDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePricingProposalDto)
  pricingProposals: CreatePricingProposalDto[];

  @ValidateNested()
  @Type(() => CreateOnboardingDto)
  onboarding: CreateOnboardingDto;
}