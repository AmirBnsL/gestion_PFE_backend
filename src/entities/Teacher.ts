import { Column, Entity, JoinColumn, PrimaryGeneratedColumn,OneToOne } from 'typeorm';
import { User } from './User';


@Entity('teacher')
export class Teacher  {
  @PrimaryGeneratedColumn()
  id: number;


  @OneToOne(() => User)
  @JoinColumn()
  user: User;
}