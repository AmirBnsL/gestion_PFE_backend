import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { AcademicYear } from '../enums/AcademicYear';

@Entity()
export class Parameter {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  maxTeams: number;

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

  @Column()
  distributionMode: 'manual' | 'automatic';
}
