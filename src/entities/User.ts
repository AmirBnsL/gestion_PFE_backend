import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';


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
}