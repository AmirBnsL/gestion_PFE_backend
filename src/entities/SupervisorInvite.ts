import {
  BeforeInsert,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Teacher } from './Teacher';
import { Project } from './Project';

// Represents an invitation for a teacher to supervise a project
@Entity()
export class SupervisorInvite {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Teacher, teacher => teacher.supervisorInvites)
  supervisor: Teacher;

  @ManyToOne(() => Project, project => project.supervisorInvites)
  project: Project;

  @Column({ nullable: false })
  initiator: 'teacher' | 'proposer';

  @Column({ nullable: false })
  createdAt: Date;

  @Column({ default: 'pending' })
  status: 'pending' | 'accepted' | 'declined';

  @BeforeInsert()
  setCreatedAt() {
    this.createdAt = new Date();
  }
}
