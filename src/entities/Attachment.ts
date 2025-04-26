import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Message } from './Message';

@Entity()
export class Attachment {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column()
  url: string;

  @Column()
  fileName: string;

  @Column()
  fileType: string;

  @Column('int')
  fileSize: number;

  @ManyToOne(() => Message, message => message.attachments, {
    onDelete: 'CASCADE',
  })
  message: Message;
}
