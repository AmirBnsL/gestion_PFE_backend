import { AppDataSource } from '../datasource';
import { Teacher } from '../entities/Teacher';
import { PageQuery, ResponseDTO } from '../dtos/genericDTOs';
import { Request, Response } from 'express';
import { Student } from '../entities/Student';
import { Project, ProjectStatus } from '../entities/Project';
import { User } from '../entities/User';
import { Announcement, Audience, Priority } from '../entities/Announcement';

const getTeachers = async (req: Request<{}, {}, {}, PageQuery>, res: Response<ResponseDTO<Teacher[]>>) => {
  const teacherRepository = AppDataSource.getRepository(Teacher);
  console.log(req.query.size);
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


const deleteUser = async (req: Request<{ id: string }, {}, {}>, res: Response<ResponseDTO<string>>) => {
  const userRepository = AppDataSource.getRepository(User);
  await userRepository.delete(parseInt(req.params.id));
  res.status(200).send({ data: 'User has been deleted' });
};

const editUser = async (req: Request<{ id: string }, {}, User>, res: Response<ResponseDTO<string>>) => {
  const userRepository = AppDataSource.getRepository(User);
  const user = await userRepository.findOneOrFail({ where: { id: parseInt(req.params.id) } });
  user.email = req.body.email;
  user.role = req.body.role;
  await userRepository.save(user);
  res.status(200).send({ data: 'User has been updated' });
};

const getProjects = async (req: Request<{}, {}, {}, PageQuery>, res: Response<ResponseDTO<Project[]>>) => {
  const projectRepository = AppDataSource.getRepository(Project);
  const projects = await projectRepository.findAndCount({
    take: parseInt(req.query.size),
    skip: parseInt(req.query.size) * (parseInt(req.query.page) - 1),
  });
  res.status(200).send({ data: projects[0] });
};

const getPendingApprovalProjects = async (req: Request<{}, {}, {}, PageQuery>, res: Response<ResponseDTO<Project[]>>) => {
  const projectRepository = AppDataSource.getRepository(Project);
  const projects = await projectRepository.findAndCount({
    take: parseInt(req.query.size),
    skip: parseInt(req.query.size) * (parseInt(req.query.page) - 1),
    where: {
      status: ProjectStatus.PROPOSED,
    },
  });
  res.status(200).send({ data: projects[0] });
};

const approveProject = async (req: Request<{ id: string }, {}, {}>, res: Response<ResponseDTO<string>>) => {
  const projectRepository = AppDataSource.getRepository(Project);
  const project = await projectRepository.findOneOrFail({ where: { id: parseInt(req.params.id) } });
  project.status = ProjectStatus.APPROVED;
  await projectRepository.save(project);
  res.status(200).send({ data: 'Project has been approved' });
};

const rejectProject = async (req: Request<{ id: string }, {}, {}>, res: Response<ResponseDTO<string>>) => {
  const projectRepository = AppDataSource.getRepository(Project);
  const project = await projectRepository.findOneOrFail({ where: { id: parseInt(req.params.id) } });
  project.status = ProjectStatus.REJECTED;
  await projectRepository.save(project);
  res.status(200).send({ data: 'Project has been rejected' });
};



export {
  getTeachers,
  getStudents,
  getProjects,
  deleteUser,
  getPendingApprovalProjects,
  approveProject,
  rejectProject,
  editUser,
};