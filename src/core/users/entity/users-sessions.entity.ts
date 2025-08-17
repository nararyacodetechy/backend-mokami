// src/modules/user/entity/user-sessions.entity.ts
import { Entity, PrimaryColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Users } from './users.entity';

@Entity('user_sessions')
export class UserSessions {
  @PrimaryColumn('char', { length: 36 })
  id: string;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({ name: 'refresh_token', type: 'varchar', nullable: true })
  refreshToken: string | null;

  @Column({ name: 'ip_address', type: 'varchar', nullable: true })
  ipAddress: string | null;

  @Column({ name: 'user_agent', type: 'text', nullable: true })
  userAgent: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Column({ name: 'expired_at', type: 'timestamp' })
  expiredAt: Date;

  // Connections
  @ManyToOne(() => Users, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: Users;
}