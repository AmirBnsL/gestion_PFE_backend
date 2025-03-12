import { Column, Entity, PrimaryGeneratedColumn, OneToOne, BeforeInsert } from 'typeorm';
import { Student } from './Student';
import { Teacher } from './Teacher';
import { Admin } from './Admin';
import bcrypt from 'bcryptjs';


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

  @OneToOne(() => Admin, admin => admin.user)
  admin: Admin;




  @BeforeInsert()
  hashPassword() {
    // Hash the password before inserting it into the database
    this.passwordHash = bcrypt.hashSync(this.passwordHash, 8);
  }

}