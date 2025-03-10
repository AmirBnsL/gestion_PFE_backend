import { User } from './User';
import { Column, Entity, JoinColumn, PrimaryGeneratedColumn,OneToOne } from 'typeorm';


@Entity('student')
export class Student  {
  @PrimaryGeneratedColumn()
  id: number;


  @OneToOne(() => Student, student => student.user)
  @JoinColumn()
  user: User;
}