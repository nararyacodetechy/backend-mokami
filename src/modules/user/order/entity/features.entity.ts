import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Requirements } from './requirements.entity';
import { Orders } from './order.entity';
import { Tasks } from './tasks.entity';

@Entity('features')
@Index('idx_features_order_id', ['orderId'])
export class Features {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'order_id' })
  orderId: string;

  @ManyToOne(() => Orders, (order) => order.features, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'order_id' })
  order: Orders;

  @Column()
  name: string;

  @Column({ type: 'text' })
  function: string;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  price: number;

  @Column()
  duration: string;

  @Column({
    type: 'enum',
    enum: ['draft', 'waiting', 'approved'],
    name: 'approval_status', // Map to the correct column name
  })
  approvalStatus: string;

  @Column({ name: 'deletion_request', default: false })
  deletionRequest: boolean;

  @Column({ name: 'is_marked_for_discussion', default: false })
  isMarkedForDiscussion: boolean;

  @Column({ name: 'discussion_note', type: 'text', nullable: true })
  discussionNote: string;

  @Column({
    type: 'enum',
    enum: ['open', 'close'],
    name: 'discussion_status', // Map to the correct column name
  })
  discussionStatus: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => Requirements, (requirement) => requirement.feature)
  requirements: Requirements[];

  @OneToMany(() => Tasks, (task) => task.feature)
  tasks: Tasks[];
}