import {
  BeforeInsert,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  ManyToMany,
  OneToOne,
} from 'typeorm';

import { Teacher } from './Teacher';
import { Team } from './Team';
import Specialty from '../enums/specialty';
import { Task } from './Task';
import { SupervisorInvite } from './SupervisorInvite';
import { ProjectSettings } from './ProjectSettings';
import { TeamJoinProjectRequest } from './TeamJoinProjectRequest';

export enum ProjectStatus {
  PROPOSED = 'proposed',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

@Entity('project')
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  title: string;

  @Column()
  description: string;

  @Column()
  startDate: Date;

  @Column()
  endDate: Date;

  @Column({
    type: 'enum',
    enum: Specialty,
  })
  specialty: Specialty;

  @Column({
    type: 'enum',
    enum: ProjectStatus,
  })
  status: string;

  @ManyToOne(() => Teacher, teacher => teacher.proposedProjects)
  proposedBy: Teacher;

  @ManyToMany(() => Teacher, teacher => teacher.supervisedProjects)
  supervisedBy: Teacher[];

  @OneToMany(() => Task, task => task.project)
  tasks: Task[];

  @OneToMany(() => Team, team => team.project)
  team: Team[];

  @OneToMany(
    () => SupervisorInvite,
    supervisorInvite => supervisorInvite.project,
  )
  supervisorInvites: SupervisorInvite[];

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;

  @Column()
  rejectionReason: string;

  @OneToMany(
    () => TeamJoinProjectRequest,
    teamJoinProjectRequest => teamJoinProjectRequest.project,
  )
  teamJoinProjectRequests: TeamJoinProjectRequest[];

  @BeforeInsert()
  setDates() {
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  @OneToOne(() => ProjectSettings, projectSettings => projectSettings.project)
  settings: ProjectSettings;
}
