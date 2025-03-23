import { Request, Response } from 'express';
import { AppDataSource } from '../configs/datasource';
import {
  AdminProfile,
  StudentProfile,
  TeacherProfile,
  UserLoginInputType,
  UserRegistrationInputType,
} from '../dtos/userDTOs';
import { ResponseDTO } from '../dtos/genericDTOs';
import bcrypt from 'bcryptjs';
import { EntityNotFoundError } from 'typeorm';

import { JwtRequest, signJwt } from '../middleware/authJwt';
import { User, UserRole } from '../entities/User';

type UserProfile = AdminProfile | StudentProfile | TeacherProfile;

async function getStudent(user: User): Promise<StudentProfile> {
  const student = user.student;
  return {
    firstname: student.firstname,
    lastname: student.lastname,
    birthdate: student.birthdate,
    academicYear: student.academicYear,
    specialty: student.specialty,
    promotionalYear: student.promotionalYear,
    email: user.email,
  };
}

async function getAdmin(user: User): Promise<AdminProfile> {
  const admin = user.admin;
  console.log(admin);
  return {
    id: admin.id,
    firstname: admin.firstname,
    lastname: admin.lastname,
    email: user.email,
  };
}

async function getTeacher(user: User): Promise<TeacherProfile> {
  const teacher = user.teacher;
  return {
    firstname: teacher.firstname,
    lastname: teacher.lastname,
    birthdate: teacher.birthdate,
    subject: teacher.subject,
    rank: teacher.rank,
    role: teacher.role,
  };
}

export const getProfile = async (
  req: JwtRequest,
  res: Response<ResponseDTO<UserProfile | string>>,
) => {
  const userRepository = AppDataSource.getRepository(User);
  try {
    const user = await userRepository.findOneOrFail({
      where: { email: req.user.sub },
      relations: ['student', 'admin', 'teacher'],
    });

    switch (user.role) {
      case UserRole.STUDENT:
        const studentProfile: StudentProfile = await getStudent(user);
        res.status(200).send({ data: studentProfile });
        break;
      case UserRole.ADMIN:
        const adminProfile: AdminProfile = await getAdmin(user);
        res.status(200).send({ data: adminProfile });
        break;
      case UserRole.TEACHER:
        const teacherProfile: TeacherProfile = await getTeacher(user);
        res.status(200).send({ data: teacherProfile });
        break;
      default:
        res.status(400).send({ data: 'Invalid role' });
        break;
    }
  } catch (error) {
    res.status(500).send({ data: 'Internal server error' });
  }
};

export const createUser = async (
  req: Request<{}, {}, UserRegistrationInputType>,
  res: Response<ResponseDTO<string>>,
) => {
  // Your implementation here
  const userRepository = AppDataSource.getRepository('User');
  if (await userRepository.existsBy({ email: req.body.email })) {
    res.status(400).send({ data: 'email already exists' });
  }

  try {
    const user = userRepository.create({
      email: req.body.email,
      passwordHash: req.body.password,
      role: req.body.role,
    });
    await userRepository.save(user);
    res.status(201).send({ data: 'user has been created' });
  } catch (error) {
    res.status(400).send({ data: 'error while creating user' });
  }
};

export const login = async (
  req: Request<{}, {}, UserLoginInputType>,
  res: Response<ResponseDTO<string>>,
) => {
  const userRepository = AppDataSource.getRepository<User>('User');
  debugger;
  try {
    const user = await userRepository.findOneByOrFail({
      email: req.body.email,
    });
    if (await bcrypt.compare(req.body.password, user.passwordHash)) {
      debugger;
      const token = signJwt(user);
      res.status(200).send({ data: token });
      return;
    } else {
      res.status(401).send({ data: 'Invalid password' });
      return;
    }
  } catch (error) {
    if (error instanceof EntityNotFoundError) {
      res.status(409).send({ data: 'user not found' });
    }
  }
};
