import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Project } from './Project';
import { Task } from './Task';
import { Team } from './Team';

export enum SprintStatus {
  ON_GOING = 'On going',
  NOT_STARTED = 'Not started',
  COMPLETED = 'Completed',
}

@Entity()
export class Sprint {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column({ type: 'date' })
  startDate: Date;

  @Column({ type: 'date' })
  endDate: Date;

  @Column({ enum: SprintStatus, type: 'enum' })
  status: string;

  @ManyToOne(() => Project, project => project.sprints, { nullable: false })
  project: Project;

  @OneToMany(() => Task, task => task.sprint)
  tasks: Task[];

  @ManyToOne(() => Team, team => team.sprints, { nullable: false })
  team: Team;

  @BeforeInsert()
  @BeforeUpdate()
  checkDates() {
    if (this.endDate <= this.startDate) {
      throw new Error('Sprint endDate must be after startDate');
    }
  }
}
