import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Project } from './Project';

@Entity()
export class ProjectSettings {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  maxSupervisors: number;

  @Column({ nullable: false })
  maxTeamPerSupervisor: number;

  @OneToOne(() => Project, project => project.settings)
  @JoinColumn()
  project: Project;
}
