import { User } from './User';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum StudentStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  GRADUATED = 'GRADUATED',
}

export enum Specialty {
  ISI = 'Informations Systems and Internet',
  SIW = 'Information Systems and Web',
  AIDS = 'Artificial intelligence and Data Sciences',
}

export enum AcademicYear {
  FIRST = '1st preparatory class',
  SECOND = '2nd preparatory class',
  THIRD = '1st superior class',
  FOURTH = '2nd superior class',
  FIFTH = '3rd superior class',
}

@Entity('student')
export class Student {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstname: string;

  @Column()
  lastname: string;

  @Column()
  birthdate: Date;

  @Column()
  promotionalYear: number;

  @Column()
  academicYear: AcademicYear;

  @Column()
  group: number;

  @Column({
    type: 'enum',
    enum: Specialty,
  })
  specialty: Specialty;

  @OneToOne(() => User, user => user.student)
  @JoinColumn()
  user: User;
}
