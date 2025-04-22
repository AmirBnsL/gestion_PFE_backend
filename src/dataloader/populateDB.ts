import { DataSource } from 'typeorm';
import { AcademicYear, Student } from '../entities/Student';
import { User, UserRole } from '../entities/User';
import * as fs from 'fs';
import * as path from 'path';

const populateDatabase = async (dataSource: DataSource) => {
  const userRepository = dataSource.getRepository(User);
  const studentRepository = dataSource.getRepository(Student);

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

  console.log('Database populated successfully!');
};

export default populateDatabase;
