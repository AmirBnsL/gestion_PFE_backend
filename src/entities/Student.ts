import { User } from './User';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('student')
export class Student  {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  birthDate: Date;

  @Column()
  address: string;

  @Column()
  phone: string
}