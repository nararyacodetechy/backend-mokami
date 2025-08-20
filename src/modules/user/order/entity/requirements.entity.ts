import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Features } from './features.entity';

@Entity('requirements')
@Index('idx_requirements_feature_id', ['featureId'])
export class Requirements {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'feature_id' })
  featureId: string;

  @ManyToOne(() => Features, (feature) => feature.requirements, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'feature_id' })
  feature: Features;

  @Column()
  title: string;

  @Column({
    type: 'enum',
    enum: ['pending', 'approved'],
    nullable: true,
  })
  status: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}