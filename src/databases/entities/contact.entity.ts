import { UserContactStatus } from '@constants/enum';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('contacts')
export class Contact extends BaseEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @ManyToOne(() => User, (user) => user.contacts, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'contact_id', referencedColumnName: 'userId' })
  contact: User;

  @ManyToOne(() => User, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'userId' })
  user: User;

  @Column({ name: 'status', type: 'enum', enum: UserContactStatus })
  status: UserContactStatus;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
