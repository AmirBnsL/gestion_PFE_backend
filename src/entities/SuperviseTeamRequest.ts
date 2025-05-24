import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  Unique,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import { Team } from './Team';
import { Teacher } from './Teacher';
import { Project } from './Project';

export enum SupervisionDirection {
  TEAM_TO_SUPERVISOR = 'TEAM_TO_SUPERVISOR',
  SUPERVISOR_TO_TEAM = 'SUPERVISOR_TO_TEAM',
}

export enum SupervisionStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
  VALIDATED_BY_PROPOSER = 'validated_by_proposer',
}
// Represents a request for supervision of a project by a team to a supervisor or vice versa
@Entity()
@Unique(['team', 'supervisor', 'project', 'status'])
@Index(['status'])
export class SuperviseTeamRequest {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Team, { nullable: false })
  team: Team;

  @ManyToOne(() => Teacher, { nullable: false })
  supervisor: Teacher;

  @ManyToOne(() => Project, { nullable: false })
  project: Project;

  @ManyToOne(() => Teacher, { nullable: false })
  projectProposer: Teacher;

  @Column({
    type: 'enum',
    enum: SupervisionDirection,
  })
  direction: SupervisionDirection;

  @Column({
    type: 'enum',
    enum: SupervisionStatus,
    default: SupervisionStatus.PENDING,
  })
  status: SupervisionStatus;

  @Column({ nullable: true })
  decidedBy: string;

  @Column({ nullable: true })
  decidedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @BeforeInsert()
  setCreatedDate() {
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  @BeforeUpdate()
  setUpdatedDate() {
    this.updatedAt = new Date();
  }
}
