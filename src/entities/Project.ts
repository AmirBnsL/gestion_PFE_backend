import { BeforeInsert, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Specialty } from './Student';
import { Teacher } from './Teacher';


export enum ProjectStatus {
  PROPOSED = 'proposed',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

@Entity('project')
export class Project {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({nullable: false})
  title: string;

  @Column()
  description: string;

  @Column()
  startDate: Date;

  @Column()
  endDate: Date;

  @Column({
    type: 'enum',
    enum: Specialty,
  })
  specialty: Specialty;

  @Column({
    type: 'enum',
    enum: ProjectStatus,
  })
  status: string;

  @ManyToOne(() => Teacher, teacher => teacher.proposedProjects)
  proposedBy: Teacher;

  @Column()
  groupId: number;

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;

  @Column()
  rejectionReason: string;


  @BeforeInsert()
  setDates() {
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }
}