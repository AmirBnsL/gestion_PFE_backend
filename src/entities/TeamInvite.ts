import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { Team } from './Team';
import { Student } from './Student';
//team invite is issued by team leader to a student
@Entity()
export class TeamInvite {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Team)
  team: Team;

  @ManyToOne(() => Student)
  toUser: Student;

  @Column({ default: 'pending' })
  status: 'pending' | 'accepted' | 'declined';

  @Column({ nullable: false })
  initiator: 'student' | 'teamLeader';

  @CreateDateColumn()
  createdAt: Date;
}
