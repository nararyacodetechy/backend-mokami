// import { Entity, PrimaryColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
// import { Onboarding } from './onboarding.entity';

// @Entity('onboarding_meetings')
// export class OnboardingMeeting {
//   @PrimaryColumn('char', { length: 36 })
//   id: string;

//   @ManyToOne(() => Onboarding, (onboarding) => onboarding.meetings, { nullable: false })
//   @JoinColumn({ name: 'onboarding_id' })
//   onboarding: Onboarding;

//   @Column({ name: 'date' })
//   date: string;

//   @Column({ name: 'time' })
//   time: string;

//   @Column({ name: 'link', nullable: true })
//   link?: string;

//   @Column({ name: 'notes', type: 'text', nullable: true })
//   notes?: string;

//   @CreateDateColumn({ name: 'created_at' })
//   createdAt: Date;
// }