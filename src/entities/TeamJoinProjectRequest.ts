import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Team } from './Team';
import { Project } from './Project';

@Entity()
export class TeamJoinProjectRequest {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Project, project => project.teamJoinProjectRequests)
  project: Project;

  @ManyToOne(() => Team)
  team: Team;

  @Column({ default: 'pending' })
  status: 'pending' | 'accepted' | 'declined';

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;

  @Column()
  initiator: string;

  @BeforeInsert()
  setCreatedAt() {
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }
  @BeforeUpdate()
  setUpdatedAt() {
    this.updatedAt = new Date();
  }
}
