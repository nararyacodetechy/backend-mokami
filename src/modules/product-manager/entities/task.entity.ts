// import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
// import { Feature } from './feature.entity';

// @Entity('tasks')
// export class Task {
//   @PrimaryColumn('char', { length: 36 })
//   id: string;

//   @ManyToOne(() => Feature, (feature) => feature.tasks, { nullable: false })
//   @JoinColumn({ name: 'feature_id' })
//   feature: Feature;

//   @Column({ name: 'title' })
//   title: string;

//   @Column({ name: 'status', type: 'enum', enum: ['todo', 'in-progress', 'done'] })
//   status: string;

//   @CreateDateColumn({ name: 'created_at' })
//   createdAt: Date;

//   @UpdateDateColumn({ name: 'updated_at' })
//   updatedAt: Date;
// }