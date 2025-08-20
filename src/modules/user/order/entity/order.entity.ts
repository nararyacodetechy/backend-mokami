import { Users } from 'src/core/users/entity/users.entity';
import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Onboardings } from './onboardings.entity';
import { Features } from './features.entity';
import { PricingProposals } from './pricing-proposals.entity';

@Entity('orders')
@Index('idx_orders_client_id', ['clientId'])
@Index('idx_orders_order_number', ['orderNumber'], { unique: true })
export class Orders {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'client_id' })
  clientId: string;

  @ManyToOne(() => Users, (user) => user.orders, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'client_id' })
  client: Users;

  @Column({ name: 'order_name' })
  orderName: string;

  @Column({ name: 'order_number', unique: true })
  orderNumber: string;

  @Column({ name: 'project_type' })
  projectType: string;

  @Column({ name: 'project_detail', type: 'text' })
  projectDetail: string;

  @Column({ nullable: true })
  reference: string;

  @Column({ nullable: true })
  image: string;

  @Column({ name: 'img_id_order', nullable: true })
  imgIdOrder: string;

  @Column({
    type: 'enum',
    enum: ['under-review', 'waiting', 'analysis-finished', 'completed'],
  })
  status: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Column({ name: 'payment_method', nullable: true })
  paymentMethod: string;

  @Column({ name: 'payment_proof', nullable: true })
  paymentProof: string;

  @Column({ name: 'budget_price', type: 'decimal', precision: 15, scale: 2, nullable: true })
  budgetPrice: number;

  @Column({ name: 'design_preference_color', nullable: true })
  designPreferenceColor: string;

  @Column({ name: 'design_preference_style', nullable: true })
  designPreferenceStyle: string;

  @Column({ name: 'total_price_features', type: 'decimal', precision: 15, scale: 2, nullable: true })
  totalPriceFeatures: number;

  @Column({ name: 'total_price_final', type: 'decimal', precision: 15, scale: 2, nullable: true })
  totalPriceFinal: number;

  @Column({
    name: 'pricing_status',
    type: 'enum',
    enum: ['negotiating', 'confirmed'],
    nullable: true,
  })
  pricingStatus: string;

  @Column({
    name: 'payment_terms',
    type: 'enum',
    enum: ['full', 'installments', 'milestones'],
    nullable: true,
  })
  paymentTerms: string;

  @Column({
    name: 'payment_status',
    type: 'enum',
    enum: ['pending', 'paid'],
    nullable: true,
  })
  paymentStatus: string;

  @OneToMany(() => Features, (feature) => feature.order)
  features: Features[];

  @OneToMany(() => PricingProposals, (proposal) => proposal.order)
  pricingProposals: PricingProposals[];

  @OneToOne(() => Onboardings, (onboarding) => onboarding.order)
  onboarding: Onboardings;
}