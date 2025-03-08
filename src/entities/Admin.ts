import {Entity, JoinColumn, PrimaryGeneratedColumn,OneToOne } from 'typeorm';
import { User } from './User';


@Entity('admin')
export class Admin  {
  @PrimaryGeneratedColumn()
  id: number;


  @OneToOne(() => User)
  @JoinColumn()
  user: User;
}