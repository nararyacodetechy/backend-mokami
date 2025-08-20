// import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
// import { Order } from './order.entity';
// import { Requirement } from './requirement.entity';
// import { Task } from './task.entity';

// @Entity('features')
// export class Feature {
//   @PrimaryColumn('char', { length: 36 })
//   id: string;

//   @ManyToOne(() => Order, (order) => order.features, { nullable: false })
//   @JoinColumn({ name: 'order_id' })
//   order: Order;

//   @Column({ name: 'name' })
//   name: string;

//   @Column({ name: 'function', type: 'text' })
//   function: string;

//   @Column({ name: 'price', type: 'decimal', precision: 15, scale: 2 })
//   price: number;

//   @Column({ name: 'duration' })
//   duration: string;

//   @Column({ name: 'approval_status', type: 'enum', enum: ['draft', 'waiting', 'approved'] })
//   approvalStatus: string;

//   @Column({ name: 'deletion_request', default: false })
//   deletionRequest: boolean;

//   @Column({ name: 'is_marked_for_discussion', default: false })
//   isMarkedForDiscussion: boolean;

//   @Column({ name: 'discussion_note', type: 'text', nullable: true })
//   discussionNote?: string;

//   @Column({ name: 'discussion_status', type: 'enum', enum: ['open', 'close'] })
//   discussionStatus: string;

//   @CreateDateColumn({ name: 'created_at' })
//   createdAt: Date;

//   @UpdateDateColumn({ name: 'updated_at' })
//   updatedAt: Date;

//   @OneToMany(() => Requirement, (requirement) => requirement.feature)
//   requirements: Requirement[];

//   @OneToMany(() => Task, (task) => task.feature)
//   tasks: Task[];
// }