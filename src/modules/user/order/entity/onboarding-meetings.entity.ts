import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Onboardings } from './onboardings.entity';

@Entity('onboarding_meetings')
@Index('idx_onboarding_meetings_onboarding_id', ['onboardingId'])
export class OnboardingMeetings {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'onboarding_id' })
  onboardingId: string;

  @ManyToOne(() => Onboardings, (onboarding) => onboarding.meetings, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'onboarding_id' })
  onboarding: Onboardings;

  @Column({ name: 'date' })
  date: string;

  @Column({ name: 'time' })
  time: string;

  @Column({ nullable: true })
  link: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}