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
export class TeamJoinRequest {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Team)
  team: Team;

  @ManyToOne(() => Student)
  fromUser: Student;

  @Column({ default: 'pending' })
  status: 'pending' | 'accepted' | 'declined';

  @CreateDateColumn()
  createdAt: Date;
}
