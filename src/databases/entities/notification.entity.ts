import { NotificationType } from '@constants/enum';
import { INotificationMetaData } from 'src/commons/interfaces/notification';
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

@Entity('notifications')
export class Notification extends BaseEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @Column({ name: 'type', type: 'enum', enum: NotificationType })
  type: NotificationType;

  @Column({ name: 'is_read', type: 'boolean', default: false })
  isRead: boolean;

  @Column({ name: 'title', length: 100 })
  title: string;

  @Column({ name: 'content', length: 200 })
  content: string;

  @ManyToOne(() => User, {
    onDelete: 'RESTRICT',
    nullable: true,
  })
  @JoinColumn({
    name: 'from_user_id',
    referencedColumnName: 'userId',
  })
  sender: User;

  @ManyToOne(() => User, {
    onDelete: 'RESTRICT',
    nullable: false,
  })
  @JoinColumn({
    name: 'to_user_id',
    referencedColumnName: 'userId',
  })
  receiver: User;

  @Column({ name: 'meta_data', type: 'jsonb', nullable: true })
  metaData: INotificationMetaData;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
