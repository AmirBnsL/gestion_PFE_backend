import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { AcademicYear } from './Student';

@Entity()
export class Parameter {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  maxTeamSize: number;
  @Column()
  allowTeamCreation: boolean;

  @Column()
  allowTeamJoining: boolean;

  @Column()
  allowWishListCreation: boolean;

  @Column({
    type: 'enum',
    enum: AcademicYear,
  })
  year: AcademicYear;
}
