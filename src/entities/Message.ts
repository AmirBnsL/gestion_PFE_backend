import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { Attachment } from './Attachment';

@Entity()
export class Message {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column()
  sender: string;

  @Column()
  senderName: string;

  @Column()
  room: string;

  @Column('text')
  message: string;

  @CreateDateColumn()
  timestamp: Date;

  @Column('simple-array')
  read: number[];

  @OneToMany(() => Attachment, attachment => attachment.message)
  attachments: Attachment[];
}
