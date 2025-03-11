import { User } from './User';
import { Column, Entity, JoinColumn, PrimaryGeneratedColumn,OneToOne } from 'typeorm';


@Entity('student')
export class Student  {
  @PrimaryGeneratedColumn()
  id: number;


  @OneToOne(() => User, user => user.student)
  @JoinColumn()
  user: User;
}