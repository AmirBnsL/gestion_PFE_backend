import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum Audience {
  STUDENTS = 'STUDENTS',
  TEACHERS = 'TEACHERS',
  ALL = 'ALL'
}

export enum Priority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH'
}

@Entity('announcements')
export class Announcement {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  body: string;

  @Column({
    type: 'enum',
    enum: Audience,
  })
  audience : Audience;

  @Column({
    type: 'enum',
    enum: Priority,
  })
  priority:Priority;
}

//TODO:websockets for announcements