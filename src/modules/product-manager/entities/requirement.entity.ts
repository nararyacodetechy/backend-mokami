import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Feature } from './feature.entity';

@Entity('requirements')
export class Requirement {
  @PrimaryColumn('char', { length: 36 })
  id: string;

  @ManyToOne(() => Feature, (feature) => feature.requirements, { nullable: false })
  @JoinColumn({ name: 'feature_id' })
  feature: Feature;

  @Column({ name: 'title' })
  title: string;

  @Column({ name: 'status', type: 'enum', enum: ['pending', 'approved'], nullable: true })
  status?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}