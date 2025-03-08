import { Column, Entity, PrimaryGeneratedColumn,OneToOne } from 'typeorm';
import { Student } from './Student';
import { Teacher } from './Teacher';


export enum UserRole {
  ADMIN = 'admin',
  TEACHER = 'teacher',
  STUDENT = 'student',
}

@Entity('user')
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  firstname: string;

  @Column()
  lastname:string;

  @Column()
  email: string;

  @Column({
    type: 'enum',
    enum: UserRole
  })
  role: UserRole;

  @Column()
  passwordHash: string;

  @OneToOne(() => Student, student => student.user)
  student: Student;

  @OneToOne(() => Teacher, teacher => teacher.user)
  teacher: Teacher;
}