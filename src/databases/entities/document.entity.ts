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
import { Message } from './message.entity';

@Entity('documents')
export class Document extends BaseEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @Column({ name: 'name', length: 200 })
  name: string;

  @Column({ name: 'description', length: 1000, nullable: true })
  description: string;

  @Column({ name: 'document_type' })
  documentType: string;

  @Column({ name: 'document_path' })
  documentPath: string;

  @Column({ name: 'document_size', type: 'float' })
  documentSize: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToMany(() => Message, (m) => m.files, {
    onDelete: 'RESTRICT',
  })
  @JoinTable({
    name: 'message_document',
    joinColumn: {
      name: 'document_id',
      foreignKeyConstraintName: 'FK_documentid_Documents',
    },
    inverseJoinColumn: {
      name: 'message_id',
      foreignKeyConstraintName: 'FK_messageid_Messages',
    },
  })
  messages: Message[];
}
