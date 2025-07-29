// src/modules/role/entity/role.entity.ts
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    PrimaryColumn,
    OneToMany,
  } from 'typeorm';
import { UserRole } from './user-roles.entity';
  
  @Entity('roles')
  export class Role {
    @PrimaryColumn('char', { length: 36 })
    id: string;
  
    @Column({ name: 'name', unique: true })
    name: string;
  
    @Column({ name: 'display_name', nullable: true })
    displayName: string;
  
    @Column({ nullable: true, type: 'text' })
    description: string;

    @CreateDateColumn({ name: 'created_at'})
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at'})
    updatedAt: Date;

    @OneToMany(() => UserRole, (userRole) => userRole.role)
    userRoles: UserRole[];
  }
  