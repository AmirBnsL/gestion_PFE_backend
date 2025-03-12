import { AppDataSource } from '../datasource';
import { Teacher } from '../entities/Teacher';
import { PageQuery, ResponseDTO } from '../dtos/genericDTOs';
import { Request, Response } from 'express';
import { Student } from '../entities/Student';

const getTeachers = async (req: Request<{}, {}, {}, PageQuery>, res: Response<ResponseDTO<Teacher[]>>) => {
  const teacherRepository = AppDataSource.getRepository(Teacher);
  console.log(req.query.size)
  const teachers = await teacherRepository.findAndCount({
    take: parseInt(req.query.size),
    skip: parseInt(req.query.size) * (parseInt(req.query.page) - 1),
  });
  res.status(200).send({ data: teachers[0] });
};

const getStudents = async (req: Request<{}, {}, {}, PageQuery>, res: Response<ResponseDTO<Student[]>>) => {
  const studentRepository = AppDataSource.getRepository(Student);
  debugger
  const students = await studentRepository.findAndCount({
    take: parseInt(req.query.size),
    skip: parseInt(req.query.size) * (parseInt(req.query.page) - 1),
  });
  res.status(200).send({ data: students[0] });
};

export { getTeachers, getStudents };