import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, CreateDateColumn } from "typeorm";
import { Role } from "./role.entity";
import { Users } from "src/core/users/entity/users.entity";

@Entity('user_roles')
export class UserRole {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id'})
  userId: string;

  @Column({ name: 'role_id'})
  roleId: string;

  @CreateDateColumn({ name: 'assigned_at' })
  assignedAt: Date;

  @ManyToOne(() => Users, user => user.userRoles, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: Users;

  @ManyToOne(() => Role, role => role.userRoles, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'role_id' })
  role: Role;
}
