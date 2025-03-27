import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Student } from './Student';
import { Project } from './Project';
import { Priority } from './Announcement';

export enum TaskStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN PROGRESS',
  DONE = 'DONE',
}

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column({
    type: 'enum',
    enum: TaskStatus,
  })
  status: TaskStatus;

  @ManyToMany(() => Student, student => student.tasks)
  @JoinTable()
  assignedTo: Student[];

  @Column({
    type: 'enum',
    enum: Priority,
  })
  priority: Priority;

  @Column()
  dueDate: Date;

  @ManyToOne(() => Project, project => project.tasks)
  project: Project;
}
