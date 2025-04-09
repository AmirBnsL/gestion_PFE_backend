import { Request, Response } from 'express';
import { AppDataSource } from '../configs/datasource';
import { Student } from '../entities/Student';
import { User } from '../entities/User';
import { JwtRequest } from '../middleware/authJwt';
//TODO: route this thing
const createStudent = async (req: JwtRequest, res: Response) => {
  try {
    const userRepository = AppDataSource.getRepository(User);
    const studentRepository = AppDataSource.getRepository(Student);

    const user = req.user;

    if (!user) {
      return res.status(400).send({ data: 'User not found in request' });
    }

    const student = new Student();
    student.firstname = req.body.firstname;
    student.lastname = req.body.lastname;
    student.birthdate = req.body.birthdate;
    student.academicYear = req.body.academicYear;
    student.specialty = req.body.specialty;
    student.promotionalYear = req.body.promotionalYear;

    user.student = student;
    student.user = user;

    await studentRepository.save(student);
    await userRepository.save(user);

    res.status(201).send({ data: 'Student created successfully' });
  } catch (error) {
    console.error('Error creating student:', error);
    res.status(500).send({ data: 'Internal server error' });
  }
};
