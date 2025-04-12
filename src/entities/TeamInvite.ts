import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { Team } from './Team';
import { Student } from './Student';

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

  @CreateDateColumn()
  createdAt: Date;
}
