import { UserRole } from '@constants/enum';
import { genSalt, hash } from 'bcrypt';
import {
  BaseEntity,
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ChatGroup } from './chat-group.entity';
import { Contact } from './contact.entity';

@Entity('users')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'user_id' })
  userId: string;

  @Column({ name: 'first_name' })
  firstName: string;

  @Column({ name: 'last_name' })
  lastName: string;

  @Column({ name: 'email' })
  email: string;

  @Column({ name: 'password' })
  password: string;

  @Column({ name: 'role', type: 'enum', enum: UserRole, default: UserRole.USER })
  role: UserRole;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => Contact, (c) => c.contact)
  @JoinColumn({ referencedColumnName: 'contact_id' })
  contacts: Contact[];

  @ManyToMany(() => ChatGroup, (c) => c.members, {
    onDelete: 'RESTRICT',
  })
  @JoinTable({
    name: 'user_chatgroup',
    joinColumn: {
      name: 'user_id',
      foreignKeyConstraintName: 'FK_userid_Users',
    },
    inverseJoinColumn: {
      name: 'chat_group_id',
      foreignKeyConstraintName: 'FK_chatgroupid_ChatGroups',
    },
  })
  chatGroups: ChatGroup[];

  @BeforeInsert()
  private async _hashPassword() {
    const salt = await genSalt(10);
    this.password = await hash(this.password, salt);
  }
}
