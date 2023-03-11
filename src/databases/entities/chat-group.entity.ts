import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('chat_groups')
export class ChatGroup extends BaseEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @Column({ name: 'name' })
  name: string;

  @Column({ name: 'message_amount', default: 0 })
  messageAmount: number;

  @Column({ name: 'member_amount', default: 0 })
  memberAmount: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToMany(() => User, (u) => u.chatGroups, {
    onDelete: 'RESTRICT',
  })
  @JoinTable({
    name: 'user_chatgroup',
    joinColumn: {
      name: 'chat_group_id',
      foreignKeyConstraintName: 'FK_chatgroupid_ChatGroups',
    },
    inverseJoinColumn: {
      name: 'user_id',
      foreignKeyConstraintName: 'FK_userid_Users',
    },
  })
  members: User[];
}
