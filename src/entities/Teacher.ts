import { Column, Entity, JoinColumn, PrimaryGeneratedColumn,OneToOne } from 'typeorm';
import { User } from './User';


@Entity('teacher')
export class Teacher  {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  birthDate: Date;

  @Column()
  address: string;

  @Column()
  phone: string


  @OneToOne(() => User)
  @JoinColumn()
  user: User;
}