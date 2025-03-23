import { User, UserRole } from '../entities/User';
import { setSeederFactory } from 'typeorm-extension';
import { faker } from '@faker-js/faker';
import { Admin } from '../entities/Admin';
import { AcademicYear, Specialty, Student } from '../entities/Student';
import { Rank, Teacher, TeacherRole } from '../entities/Teacher';
import { Project, ProjectStatus } from '../entities/Project';

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
    AcademicYear.FIFTH,
  ]);
  student.group = faker.number.int({ min: 1, max: 10 });
  student.specialty = faker.helpers.arrayElement([
    Specialty.AIDS,
    Specialty.ISI,
    Specialty.SIW,
  ]);
  return student;
});

export const teacherFactory = setSeederFactory(Teacher, () => {
  const teacher = new Teacher();
  teacher.firstname = faker.person.firstName();
  teacher.lastname = faker.person.lastName();
  teacher.birthdate = faker.date.birthdate();
  teacher.subject = faker.helpers.arrayElement([
    'Analyse',
    'Systems',
    'Architecture',
    'Algebra',
  ]);
  teacher.rank = faker.helpers.arrayElement([
    Rank.Assistant,
    Rank.Associate,
    Rank.Professor,
  ]);
  teacher.role = faker.helpers.arrayElement([
    TeacherRole.INSTRUCTOR,
    TeacherRole.LECTURER,
  ]);
  return teacher;
});

export const projectFactory = setSeederFactory(Project, () => {
  const project = new Project();
  project.title = faker.lorem.words(3);
  project.description = faker.lorem.sentence();
  project.startDate = faker.date.past();
  project.endDate = faker.date.future();
  project.specialty = faker.helpers.arrayElement([
    Specialty.AIDS,
    Specialty.ISI,
    Specialty.SIW,
  ]);
  project.status = faker.helpers.arrayElement([
    ProjectStatus.APPROVED,
    ProjectStatus.PROPOSED,
    ProjectStatus.COMPLETED,
    ProjectStatus.REJECTED,
    ProjectStatus.IN_PROGRESS,
    ProjectStatus.CANCELLED,
  ]);
  project.groupId = faker.number.int({ min: 1, max: 10 });
  project.createdAt = faker.date.past();
  project.updatedAt = faker.date.recent();
  project.rejectionReason = faker.lorem.sentence();
  return project;
});
