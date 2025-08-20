// import { Entity, PrimaryColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
// import { Order } from './order.entity';

// @Entity('pricing_proposals')
// export class PricingProposal {
//   @PrimaryColumn('char', { length: 36 })
//   id: string;

//   @ManyToOne(() => Order, (order) => order.pricingProposals, { nullable: false })
//   @JoinColumn({ name: 'order_id' })
//   order: Order;

//   @Column({ name: 'amount', type: 'decimal', precision: 15, scale: 2 })
//   amount: number;

//   @Column({ name: 'discount', type: 'decimal', precision: 15, scale: 2 })
//   discount: number;

//   @Column({ name: 'tax_rate', type: 'decimal', precision: 5, scale: 2 })
//   taxRate: number;

//   @Column({ name: 'commission_rate', type: 'decimal', precision: 5, scale: 2 })
//   commissionRate: number;

//   @Column({ name: 'notes', type: 'text', nullable: true })
//   notes?: string;

//   @Column({ name: 'proposed_by', type: 'enum', enum: ['PM', 'Client'] })
//   proposedBy: string;

//   @CreateDateColumn({ name: 'created_at' })
//   createdAt: Date;
// }