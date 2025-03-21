import { UserRole } from '../entities/User';
import { Column } from 'typeorm';
import { AcademicYear, Specialty } from '../entities/Student';
import { Rank, TeacherRole } from '../entities/Teacher';

export interface UserType {
  id:number
  password:string
  firstname:string
  lastname:string
  email:string

}


export interface UserRegistrationInputType {
  password:string
  firstname:string
  lastname:string
  email:string
  role:UserRole
}

export interface UserLoginInputType {
  email:string
  password:string
}

export interface AdminProfile {
  id:number
  firstname:string
  lastname:string
  email:string
}

export interface StudentProfile {

  firstname: string;
  lastname: string;
  birthdate: Date;
  promotionalYear: number;
  academicYear: AcademicYear;
  Specialty: Specialty;
}


export interface TeacherProfile {

  firstname:string
  lastname:string
  birthdate:Date
  subject:string
  rank:Rank
  role:TeacherRole
}
