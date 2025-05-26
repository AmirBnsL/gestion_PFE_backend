import { Teacher } from './Teacher';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Team } from './Team';
import { PresentationDay } from './PresentationDay';

@Entity()
export class PresentationSlot {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => PresentationDay, day => day.slots)
  presentationDay: PresentationDay;

  @Column({ type: 'time' })
  startTime: string;

  @Column()
  endTime: string;

  @OneToOne(() => Team, team => team.presentationDay)
  @JoinColumn()
  team: Team;

  @Column()
  room: string;

  @ManyToMany(() => Teacher)
  @JoinTable()
  judges: Teacher[];
}
