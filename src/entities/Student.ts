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
import Specialty from '../enums/specialty';
import { Task } from './Task';
import { TeamMembership } from './TeamMemberships';
import { TeamInvite } from './TeamInvite';
import { TeamJoinRequest } from './TeamJoinRequest';
import { AcademicYear } from '../enums/AcademicYear';

export enum StudentStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  GRADUATED = 'GRADUATED',
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

  @OneToOne(() => TeamMembership, membership => membership.student)
  teamMembership: TeamMembership;

  // Members of the team (via TeamMembership)
  @OneToMany(() => TeamMembership, membership => membership.team)
  memberships: TeamMembership[];

  // Invites sent by this team
  @OneToMany(() => TeamInvite, invite => invite.team)
  invites: TeamInvite[];

  // Join requests sent to this team
  @OneToMany(() => TeamJoinRequest, request => request.team)
  joinRequests: TeamJoinRequest[];
}
