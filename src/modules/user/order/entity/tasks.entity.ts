import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Features } from './features.entity';

@Entity('tasks')
@Index('idx_tasks_feature_id', ['featureId'])
export class Tasks {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'feature_id' })
  featureId: string;

  @ManyToOne(() => Features, (feature) => feature.tasks, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'feature_id' })
  feature: Features;

  @Column()
  title: string;

  @Column({
    type: 'enum',
    enum: ['todo', 'in-progress', 'done'],
  })
  status: string;

  @Column({ nullable: true })
  deadline: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}