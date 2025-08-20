import { Column, CreateDateColumn, Entity, Index, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Orders } from './order.entity';
import { OnboardingMeetings } from './onboarding-meetings.entity';

@Entity('onboardings')
@Index('idx_onboardings_order_id', ['orderId'])
export class Onboardings {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'order_id' })
  orderId: string;

  @OneToOne(() => Orders, (order) => order.onboarding, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'order_id' })
  order: Orders;

  @Column({
    type: 'enum',
    enum: ['initial', 'in-progress', 'completed'],
  })
  status: string;

  @Column({ name: 'analysis_notes', type: 'text', nullable: true })
  analysisNotes: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => OnboardingMeetings, (meeting) => meeting.onboarding)
  meetings: OnboardingMeetings[];
}