import { User } from './User';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Team } from './Team';
import Specialty from '../enums/specialty';
import { Task } from './Task';

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

export enum StudentJob {
  FRONTEND = 'Front-end',
  BACKEND = 'Back-end',
  FULLSTACK = 'Full-stack',
  DEVOPS = 'DevOps',
  DATA_SCIENTIST = 'Data Scientist',
  DATA_ANALYST = 'Data Analyst',
  GAME_DEV = 'Game Developer',
  MOBILE_DEV = 'Mobile Developer',
  QA = 'Quality Assurance',
  UI_UX = 'UI/UX Designer',
}

@Entity('student')
export class Student {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: StudentStatus,
    default: StudentStatus.ACTIVE,
  })
  status: StudentStatus;

  @Column({
    type: 'enum',
    enum: StudentJob,
  })
  job: StudentJob;

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

  @ManyToOne(() => Team, team => team.students)
  team: Team;

  @Column({
    type: 'enum',
    enum: Specialty,
  })
  specialty: Specialty;

  @OneToOne(() => User, user => user.student)
  @JoinColumn()
  user: User;

  @ManyToMany(() => Task, task => task.assignedTo)
  tasks: Task[];
}
