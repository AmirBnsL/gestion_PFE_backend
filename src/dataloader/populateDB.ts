import { DataSource } from 'typeorm';
import { Student } from '../entities/Student';
import { User, UserRole } from '../entities/User';
import { Rank, Teacher, TeacherRole } from '../entities/Teacher';
import * as fs from 'fs';
import * as path from 'path';
import { faker } from '@faker-js/faker';
import { AcademicYear } from '../enums/AcademicYear';

const populateDatabase = async (dataSource: DataSource) => {
  const userRepository = dataSource.getRepository(User);
  const studentRepository = dataSource.getRepository(Student);
  const teacherRepository = dataSource.getRepository(Teacher);

  // Read and parse the JSON file
  const filePath = path.join(__dirname, 'promos', 'etudiants1cs.json');
  const jsonData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

  for (const entry of jsonData) {
    if (entry.role === 'student') {
      // Create a new User
      const user = new User();
      user.email = entry.email;
      user.passwordHash = 'admin'; // Hash the password
      user.role = UserRole.STUDENT;

      // Save the user
      const savedUser = await userRepository.save(user);

      // Create a new Student
      const student = new Student();
      student.firstname = entry.name.split(' ')[0]; // Extract first name
      student.lastname = entry.name.split(' ').slice(1).join(' '); // Extract last name
      student.group = entry.group;
      student.user = savedUser;
      student.birthdate = new Date();
      student.promotionalYear = 2023;
      student.academicYear = AcademicYear.THIRD; // Assuming a default value

      // Save the student
      await studentRepository.save(student);
    }
  }

  // Manually create and save 5 teachers
  const teachersData = [
    { firstname: 'John', lastname: 'Doe', email: 'john.doe@school.com' },
    { firstname: 'Jane', lastname: 'Smith', email: 'jane.smith@school.com' },
    {
      firstname: 'Alice',
      lastname: 'Johnson',
      email: 'alice.johnson@school.com',
    },
    { firstname: 'Bob', lastname: 'Brown', email: 'bob.brown@school.com' },
    {
      firstname: 'Charlie',
      lastname: 'Davis',
      email: 'charlie.davis@school.com',
    },
  ];

  for (let i = 0; i < 5; i++) {
    const user = new User();
    user.email = faker.internet.email();
    user.passwordHash = 'admin'; // Hash the password
    user.role = UserRole.TEACHER;

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
    teacher.user = user;
    user.teacher = teacher;

    await userRepository.save(user);
    await teacherRepository.save(teacher);
  }

  console.log('Database populated successfully!');
};

export default populateDatabase;
