// import { Entity, PrimaryColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
// import { Users } from 'src/core/users/entity/users.entity';
// import { PricingProposal } from './pricing-proposal.entity';
// import { Onboarding } from './onboarding.entity';
// import { Feature } from './feature.entity';

// @Entity('orders')
// export class Order {
//   @PrimaryColumn('char', { length: 36 })
//   id: string;

//   @Column({ name: 'client_name' })
//   clientName: string;

//   @ManyToOne(() => Users, { nullable: false })
//   @JoinColumn({ name: 'client_id' })
//   client: Users;

//   @Column({ name: 'username', nullable: true })
//   username?: string;

//   @Column({ name: 'nik', length: 16, nullable: true })
//   nik?: string;

//   @Column({ name: 'email', nullable: true })
//   email?: string;

//   @Column({ name: 'address', type: 'text', nullable: true })
//   address?: string;

//   @Column({ name: 'phone', nullable: true })
//   phone?: string;

//   @Column({ name: 'company', nullable: true })
//   company?: string;

//   @Column({ name: 'image_profile', nullable: true })
//   imageProfile?: string;

//   @Column({ name: 'order_name' })
//   orderName: string;

//   @Column({ name: 'order_number', unique: true })
//   orderNumber: string;

//   @Column({ name: 'project_type' })
//   projectType: string;

//   @Column({ name: 'project_detail', type: 'text' })
//   projectDetail: string;

//   @Column({ name: 'reference', nullable: true })
//   reference?: string;

//   @Column({ name: 'image', nullable: true })
//   image?: string;

//   @Column({ name: 'img_id_order', nullable: true })
//   imgIdOrder?: string;

//   @Column({ name: 'status', type: 'enum', enum: ['under-review', 'waiting', 'analysis-finished', 'completed'] })
//   status: string;

//   @CreateDateColumn({ name: 'created_at' })
//   createdAt: Date;

//   @Column({ name: 'payment_method', nullable: true })
//   paymentMethod?: string;

//   @Column({ name: 'payment_proof', nullable: true })
//   paymentProof?: string;

//   @Column({ name: 'budget_price', type: 'decimal', precision: 15, scale: 2, nullable: true })
//   budgetPrice?: number;

//   @Column({ name: 'design_preference_color', nullable: true })
//   designPreferenceColor?: string;

//   @Column({ name: 'design_preference_style', nullable: true })
//   designPreferenceStyle?: string;

//   @Column({ name: 'total_price_features', type: 'decimal', precision: 15, scale: 2, nullable: true })
//   totalPriceFeatures?: number;

//   @Column({ name: 'total_price_final', type: 'decimal', precision: 15, scale: 2, nullable: true })
//   totalPriceFinal?: number;

//   @Column({ name: 'pricing_status', type: 'enum', enum: ['negotiating', 'confirmed'], nullable: true })
//   pricingStatus?: string;

//   @Column({ name: 'payment_terms', type: 'enum', enum: ['full', 'installments', 'milestones'], nullable: true })
//   paymentTerms?: string;

//   @Column({ name: 'payment_status', type: 'enum', enum: ['pending', 'paid'], nullable: true })
//   paymentStatus?: string;

//   @OneToMany(() => Feature, (feature) => feature.order)
//   features: Feature[];

//   @OneToMany(() => PricingProposal, (pricingProposal) => pricingProposal.order)
//   pricingProposals: PricingProposal[];

//   @OneToMany(() => Onboarding, (onboarding) => onboarding.order)
//   onboardings: Onboarding[];
// }