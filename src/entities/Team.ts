import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Project } from './Project';
import { Student } from './Student';
import { TeamMembership } from './TeamMemberships';
import { TeamInvite } from './TeamInvite';
import { TeamJoinRequest } from './TeamJoinRequest';

@Entity()
@Unique(['name'])
export class Team {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Student, { cascade: true })
  @JoinColumn()
  teamLeader: Student;

  @Column()
  name: string;

  @ManyToOne(() => Project, project => project.team, { cascade: true })
  project: Project;

  @OneToMany(() => TeamMembership, membership => membership.student)
  members: TeamMembership[];

  // Invites sent by this team
  @OneToMany(() => TeamInvite, invite => invite.team)
  invites: TeamInvite[];

  // Join requests sent to this team
  @OneToMany(() => TeamJoinRequest, request => request.team)
  joinRequests: TeamJoinRequest[];
}
