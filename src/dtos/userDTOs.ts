import { UserRole } from '../entities/User';
import { Column } from 'typeorm';
import { AcademicYear } from '../entities/Student';
import { Rank, TeacherRole } from '../entities/Teacher';
import Specialty from '../enums/specialty';

export class UserType {
  id: number;
  password: string;
  firstname: string;
  lastname: string;
  email: string;
}

export class UserRegistrationInputType {
  password: string;
  firstname: string;
  lastname: string;
  email: string;
  role: UserRole;
}

export class UserLoginInputType {
  email: string;
  password: string;
}

export class AdminProfile {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
}

export class StudentProfile {
  firstname: string;
  lastname: string;
  birthdate: Date;
  promotionalYear: number;
  academicYear: AcademicYear;
  specialty: Specialty;
  email: string;
}

export class TeacherProfile {
  firstname: string;
  lastname: string;
  birthdate: Date;
  subject: string;
  rank: Rank;
  role: TeacherRole;
}
