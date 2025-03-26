import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Project } from './Project';
import { Student } from './Student';


@Entity()
export class Team {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToOne(() => Project, project => project.team,{ cascade: true })
  @JoinColumn()
  project: Project;

  @OneToMany(() => Student, student => student.team,{ cascade: true })
  students: Student[];


}