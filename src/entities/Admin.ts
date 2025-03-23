import {
  Entity,
  JoinColumn,
  PrimaryGeneratedColumn,
  OneToOne,
  Column,
} from 'typeorm';
import { User } from './User';

@Entity('admin')
export class Admin {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstname: string;

  @Column()
  lastname: string;

  @OneToOne(() => User)
  @JoinColumn()
  user: User;
}
