import { User } from './User';
import {
  Column,
  Entity,
  JoinColumn, ManyToOne, OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Team } from './Team';
import Specialty from '../enums/specialty';

export enum StudentStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  GRADUATED = 'GRADUATED',
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

  @ManyToOne(()=> Team, team => team.students)
  team: Team;

  @Column({
    type: 'enum',
    enum: Specialty,
  })
  specialty: Specialty;

  @OneToOne(() => User, user => user.student)
  @JoinColumn()
  user: User;

}
