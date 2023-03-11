import { MessageType } from '@constants/enum';
import { IMessageMetaData } from 'src/commons/interfaces/message';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Document } from './document.entity';

@Entity('messages')
export class Message extends BaseEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @ManyToOne(() => User, {
    onDelete: 'RESTRICT',
    nullable: false,
  })
  @JoinColumn({
    name: 'sender_id',
    referencedColumnName: 'userId',
  })
  sender: User;

  @ManyToOne(() => User, {
    onDelete: 'RESTRICT',
    nullable: false,
  })
  @JoinColumn({
    name: 'receiver_id',
    referencedColumnName: 'userId',
  })
  receiver: User;

  @ManyToMany(() => Document, (d) => d.messages, {
    onDelete: 'RESTRICT',
  })
  @JoinTable({
    name: 'message_document',
    joinColumn: {
      name: 'message_id',
      foreignKeyConstraintName: 'FK_messageid_Messages',
    },
    inverseJoinColumn: {
      name: 'document_id',
      foreignKeyConstraintName: 'FK_documentid_Documents',
    },
  })
  files: Document[];

  @Column({ name: 'content', nullable: true })
  content: string;

  @Column({ name: 'type', type: 'enum', enum: MessageType, nullable: false })
  type: MessageType;

  @Column({ name: 'meta_data', type: 'jsonb', nullable: true })
  metaData: IMessageMetaData;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
