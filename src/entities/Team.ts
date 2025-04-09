import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Project } from './Project';
import { Student } from './Student';

@Entity()
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

  @OneToMany(() => Student, student => student.team, { cascade: true })
  students: Student[];
}
