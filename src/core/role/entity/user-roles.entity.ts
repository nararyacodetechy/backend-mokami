// src\core\role\entity\user-roles.entity.ts
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, CreateDateColumn } from "typeorm";
import { Roles } from "./roles.entity";
import { Users } from "src/core/users/entity/users.entity";

@Entity('user_roles')
export class UserRoles {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id'})
  userId: string;

  @Column({ name: 'role_id'})
  roleId: string;

  @CreateDateColumn({ name: 'assigned_at' })
  assignedAt: Date;

  // ini menghubungkan roles dan users
  @ManyToOne(() => Users, user => user.userRoles, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: Users;

  @ManyToOne(() => Roles, role => role.userRoles, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'role_id' })
  role: Roles;
}
