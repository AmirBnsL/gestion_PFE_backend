import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { PresentationSlot } from './PresentationSlot';
import { AcademicYear } from '../enums/AcademicYear';

@Entity()
export class PresentationDay {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  date: Date;

  @Column({
    type: 'enum',
    enum: AcademicYear,
  })
  academicYear: AcademicYear;

  @Column({ default: 'draft' })
  status: 'draft' | 'published';

  @OneToMany(() => PresentationSlot, slot => slot.presentationDay)
  slots: PresentationSlot[];
}
