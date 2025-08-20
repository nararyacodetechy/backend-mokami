import { Roles } from 'src/core/role/entity/roles.entity';
import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, ManyToMany, JoinTable, OneToMany, OneToOne } from 'typeorm';
import { UserSessions } from './users-sessions.entity';
import { Orders } from 'src/modules/user/order/entity/order.entity';
import { UserRoles } from 'src/core/role/entity/user-roles.entity';
import { UserProfiles } from 'src/core/profile/entity/user-profiles.entity';

@Entity('users')
export class Users {
  @PrimaryColumn('char', { length: 36 })
  id: string;

  @Column({ name: 'email', unique: true })
  email: string;

  @Column({ name: 'hashed_password', type: 'varchar', length: 255, nullable: true })
  hashedPassword: string | null;

  @ManyToOne(() => Roles, { nullable: true, eager: true })
  @JoinColumn({ name: 'active_role_id' })
  activeRole: Roles;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ name: 'is_email_verified', default: false })
  isEmailVerified: boolean;

  @Column({ name: 'email_verification_token', type: 'varchar', nullable: true })
  emailVerificationToken: string | null;

  @Column({ name: 'email_verification_expires', type: 'timestamp', nullable: true })
  emailVerificationExpires: Date | null;

  @Column({ name: 'password_reset_token', type: 'varchar', nullable: true })
  passwordResetToken: string | null;

  @Column({ name: 'password_reset_expires', type: 'timestamp', nullable: true })
  passwordResetExpires: Date | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Connections
  @ManyToMany(() => Roles)
  @JoinTable({
    name: 'user_roles',
    joinColumn: { name: 'user_id' },
    inverseJoinColumn: { name: 'role_id' },
  })
  roles: Roles[];

  @OneToMany(() => UserRoles, (userRole) => userRole.user)
  userRoles: UserRoles[];

  @OneToOne(() => UserProfiles, (profile) => profile.userId, { cascade: true })
  profile: UserProfiles;

  @OneToMany(() => UserSessions, (session) => session.user)
  sessions: UserSessions[];

  @OneToMany(() => Orders, (order) => order.client)
  orders: Orders[];
}