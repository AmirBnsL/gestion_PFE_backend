import { User, UserRole } from '../entities/User';
import { setSeederFactory } from 'typeorm-extension';
import { faker } from '@faker-js/faker';
import { Admin } from '../entities/Admin';
import { AcademicYear, Specialty, Student } from '../entities/Student';
import { rank, Teacher, TeacherRole } from '../entities/Teacher';
import adminRoutes from '../routes/adminRoutes';

export const userFactory = setSeederFactory(User, () => {
  const user = new User();
  user.email = faker.internet.email();
  user.role = faker.helpers.arrayElement([UserRole.STUDENT, UserRole.TEACHER]);
  user.passwordHash = faker.internet.password();
  return user;
});

export const adminFactory = setSeederFactory(Admin, () => {
  const admin = new Admin();
  admin.firstname = faker.person.firstName();
  admin.lastname = faker.person.lastName();
  return admin;
});

export const studentFactory = setSeederFactory(Student, () => {
  const student = new Student();
  student.firstname = faker.person.firstName();
  student.lastname = faker.person.lastName();
  student.birthdate = faker.date.birthdate();
  student.promotionalYear = faker.number.int({ min: 2022, max: 2027 });
  student.academicYear = faker.helpers.arrayElement([
    AcademicYear.FIFTH,
    AcademicYear.SECOND,
    AcademicYear.THIRD,
    AcademicYear.SECOND,
    AcademicYear.FIFTH
  ]);
  student.group = faker.number.int({ min: 1, max: 10 });
  student.specialty = faker.helpers.arrayElement([
    Specialty.AIDS, Specialty.ISI, Specialty.SIW
  ]);
  return student;
});

export const teacherFactory = setSeederFactory(Teacher, () => {
  const teacher = new Teacher();
  teacher.firstname = faker.person.firstName();
  teacher.lastname = faker.person.lastName();
  teacher.birthdate = faker.date.birthdate();
  teacher.subject = faker.helpers.arrayElement(['Analyse', 'Systems', 'Architecture', 'Algebra']);
  teacher.rank = faker.helpers.arrayElement([rank.Assistant, rank.Associate, rank.Professor]);
  teacher.role = faker.helpers.arrayElement([TeacherRole.INSTRUCTOR, TeacherRole.LECTURER]);
  return teacher;
});