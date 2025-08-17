// src/modules/role/entity/role.entity.ts

import {
    Entity,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    PrimaryColumn,
    OneToMany,
  } from 'typeorm';
import { UserRoles } from './user-roles.entity';
  
  @Entity('roles')
  export class Roles {
    @PrimaryColumn('char', { length: 36 })
    id: string;
  
    @Column({ name: 'role_name', unique: true })
    role_name: string;
  
    @Column({ name: 'display_name', nullable: true })
    displayName: string;
  
    @Column({ name: 'description_role', nullable: true, type: 'text' })
    descriptionRole: string;

    @CreateDateColumn({ name: 'created_at'})
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at'})
    updatedAt: Date;

    // Connections
    @OneToMany(() => UserRoles, (userRole) => userRole.role)
    userRoles: UserRoles[];
  }
  