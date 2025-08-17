import { Users } from 'src/core/users/entity/users.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';

@Entity({ name: 'user_profiles' })
export class UserProfiles {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => Users, user => user.profile, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' }) // foreign key ke tabel users
  userId: Users;

  @Column({ name: 'full_name', type: 'varchar', length: 255, nullable: true })
  fullName?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  username?: string;

  @Column({ type: 'varchar', length: 16, nullable: true })
  nik?: string;

  @Column({ type: 'text', nullable: true })
  address?: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  company?: string;

  @Column({ name: 'image_profile', type: 'varchar', length: 255, nullable: true })
  imageProfile?: string;
}
