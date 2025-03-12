import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './User';

export enum rank {
  Assistant = 'Assistant',
  Associate = 'Associate',
  Professor = 'Professor'
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
  birthdate:Date;

  @Column({
    type: 'enum',
    enum: rank,
  })
  rank: rank;

  @Column({
    type: 'enum',
    enum: TeacherRole,
  })
  role: TeacherRole;


  @OneToOne(() => User)
  @JoinColumn()
  user: User;
}