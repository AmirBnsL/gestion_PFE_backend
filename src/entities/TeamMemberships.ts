import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Unique,
  CreateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';

import { Team } from './Team';
import { Student } from './Student';

//you might be wondering why i use teammembership instead of members inside team class, thats because i needed metadata for the relation like date joined to be future proof

@Entity()
@Unique(['student']) // One user in only one team
export class TeamMembership {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Team, team => team.members)
  team: Team;

  @OneToOne(() => Student, student => student.teamMembership)
  @JoinColumn()
  student: Student;

  @CreateDateColumn()
  joinedAt: Date;
}
