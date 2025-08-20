// import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
// import { Order } from './order.entity';
// import { OnboardingMeeting } from './onboarding-meeting.entity';

// @Entity('onboardings')
// export class Onboarding {
//   @PrimaryColumn('char', { length: 36 })
//   id: string;

//   @ManyToOne(() => Order, (order) => order.onboardings, { nullable: false })
//   @JoinColumn({ name: 'order_id' })
//   order: Order;

//   @Column({ name: 'status', type: 'enum', enum: ['initial', 'in-progress', 'completed'] })
//   status: string;

//   @Column({ name: 'analysis_notes', type: 'text', nullable: true })
//   analysisNotes?: string;

//   @CreateDateColumn({ name: 'created_at' })
//   createdAt: Date;

//   @UpdateDateColumn({ name: 'updated_at' })
//   updatedAt: Date;

//   @OneToMany(() => OnboardingMeeting, (meeting) => meeting.onboarding)
//   meetings: OnboardingMeeting[];
// }