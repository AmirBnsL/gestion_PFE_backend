import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { User } from './User';
import { Project } from './Project';
import { SupervisorInvite } from './SupervisorInvite';
import { PresentationSlot } from './PresentationSlot';

export enum Rank {
  Assistant = 'Assistant',
  Associate = 'Associate',
  Professor = 'Professor',
}

export enum TeacherRole {
  LECTURER = 'LECTURER',
  INSTRUCTOR = 'INSTRUCTOR',
}

@Entity('teacher')
export class Teacher {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  subject: string;

  @Column()
  firstname: string;

  @Column()
  lastname: string;

  @Column()
  birthdate: Date;

  @Column({
    type: 'enum',
    enum: Rank,
  })
  rank: Rank;

  @Column({
    type: 'enum',
    enum: TeacherRole,
  })
  role: TeacherRole;

  @OneToOne(() => User)
  @JoinColumn()
  user: User;

  @OneToMany(() => Project, project => project.proposedBy)
  proposedProjects: Project;

  @ManyToMany(() => Project, project => project.supervisedBy)
  @JoinTable()
  supervisedProjects: Project[];

  @OneToMany(() => SupervisorInvite, invite => invite.supervisor)
  supervisorInvites: SupervisorInvite[];

  @ManyToMany(
    () => PresentationSlot,
    presentationSlot => presentationSlot.judges,
  )
  presentationSlots: PresentationSlot[];
}
