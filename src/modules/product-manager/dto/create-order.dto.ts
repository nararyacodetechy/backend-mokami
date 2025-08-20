// import { IsString, IsNotEmpty, IsOptional, IsNumber, IsEnum, IsArray, ValidateNested } from 'class-validator';
// import { Type } from 'class-transformer';

// export class CreateFeatureDto {
//   @IsString()
//   @IsNotEmpty()
//   name: string;

//   @IsString()
//   @IsNotEmpty()
//   function: string;

//   @IsNumber()
//   price: number;

//   @IsString()
//   @IsNotEmpty()
//   duration: string;

//   @IsEnum(['draft', 'waiting', 'approved'])
//   approvalStatus: string;

//   @IsArray()
//   @IsOptional()
//   @ValidateNested({ each: true })
//   @Type(() => CreateRequirementDto)
//   requirements?: CreateRequirementDto[];

//   @IsOptional()
//   isMarkedForDiscussion?: boolean;

//   @IsOptional()
//   discussionNote?: string;

//   @IsEnum(['open', 'close'])
//   discussionStatus: string;

//   @IsArray()
//   @IsOptional()
//   @ValidateNested({ each: true })
//   @Type(() => CreateTaskDto)
//   tasks?: CreateTaskDto[];
// }

// export class CreateRequirementDto {
//   @IsString()
//   @IsNotEmpty()
//   title: string;

//   @IsOptional()
//   @IsEnum(['pending', 'approved'])
//   status?: string;
// }

// export class CreateTaskDto {
//   @IsString()
//   @IsNotEmpty()
//   title: string;

//   @IsEnum(['todo', 'in-progress', 'done'])
//   status: string;
// }

// export class CreatePricingProposalDto {
//   @IsNumber()
//   amount: number;

//   @IsNumber()
//   discount: number;

//   @IsNumber()
//   taxRate: number;

//   @IsNumber()
//   commissionRate: number;

//   @IsOptional()
//   @IsString()
//   notes?: string;

//   @IsEnum(['PM', 'Client'])
//   proposedBy: string;
// }

// export class CreateOnboardingMeetingDto {
//   @IsString()
//   @IsNotEmpty()
//   date: string;

//   @IsString()
//   @IsNotEmpty()
//   time: string;

//   @IsOptional()
//   @IsString()
//   link?: string;

//   @IsOptional()
//   @IsString()
//   notes?: string;
// }

// export class CreateOnboardingDto {
//     @IsEnum(['initial', 'meeting_scheduled', 'analysis_complete', 'completed'])
//     status: string;

//     @IsOptional()
//     @IsString()
//     analysisNotes?: string;

//     @IsArray()
//     @IsOptional()
//     @ValidateNested({ each: true })
//     @Type(() => CreateOnboardingMeetingDto)
//     meetings?: CreateOnboardingMeetingDto[];
// }

// export class CreateOrderDto {
//   @IsString()
//   @IsNotEmpty()
//   clientName: string;

//   @IsString()
//   @IsNotEmpty()
//   clientId: string;

//   @IsOptional()
//   @IsString()
//   username?: string;

//   @IsOptional()
//   @IsString()
//   nik?: string;

//   @IsOptional()
//   @IsString()
//   email?: string;

//   @IsOptional()
//   @IsString()
//   address?: string;

//   @IsOptional()
//   @IsString()
//   phone?: string;

//   @IsOptional()
//   @IsString()
//   company?: string;

//   @IsOptional()
//   @IsString()
//   imageProfile?: string;

//   @IsString()
//   @IsNotEmpty()
//   orderName: string;

//   @IsString()
//   @IsNotEmpty()
//   orderNumber: string;

//   @IsString()
//   @IsNotEmpty()
//   projectType: string;

//   @IsString()
//   @IsNotEmpty()
//   projectDetail: string;

//   @IsOptional()
//   @IsString()
//   reference?: string;

//   @IsOptional()
//   @IsString()
//   image?: string;

//   @IsOptional()
//   @IsString()
//   imgIdOrder?: string;

//   @IsEnum(['under-review', 'waiting', 'analysis-finished', 'completed'])
//   status: string;

//   @IsOptional()
//   @IsString()
//   paymentMethod?: string;

//   @IsOptional()
//   @IsString()
//   paymentProof?: string;

//   @IsOptional()
//   @IsNumber()
//   budgetPrice?: number;

//   @IsOptional()
//   designPreference?: {
//     color: string;
//     style: string;
//   };

//   @IsOptional()
//   @IsNumber()
//   totalPriceFeatures?: number;

//   @IsOptional()
//   @IsNumber()
//   totalPriceFinal?: number;

//   @IsOptional()
//   @IsEnum(['negotiating', 'confirmed'])
//   pricingStatus?: string;

//   @IsOptional()
//   @IsEnum(['full', 'installments', 'milestones'])
//   paymentTerms?: string;

//   @IsOptional()
//   @IsEnum(['pending', 'paid'])
//   paymentStatus?: string;

//   @IsArray()
//   @IsOptional()
//   @ValidateNested({ each: true })
//   @Type(() => CreateFeatureDto)
//   features?: CreateFeatureDto[];

//   @IsArray()
//   @IsOptional()
//   @ValidateNested({ each: true })
//   @Type(() => CreatePricingProposalDto)
//   pricingProposals?: CreatePricingProposalDto[];

//   @IsOptional()
//   @ValidateNested()
//   @Type(() => CreateOnboardingDto)
//   onboarding?: CreateOnboardingDto;
// }