import { Entity, PrimaryColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Users } from './users.entity';

@Entity('user_sessions')
export class UserSessions {
  @PrimaryColumn('char', { length: 36 })
  id: string;

  @Column({ name: 'user_id' })
  userId: string;

  @ManyToOne(() => Users, (user) => user.sessions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: Users;

  @Column({ name: 'refresh_token', type: 'varchar', length: 512, nullable: true })
  refreshToken: string | null;

  @Column({ name: 'ip_address', type: 'varchar', length: 64, nullable: true })
  ipAddress: string | null;

  @Column({ name: 'user_agent', type: 'text', nullable: true })
  userAgent: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Column({ name: 'expired_at', type: 'timestamp' })
  expiredAt: Date;
}