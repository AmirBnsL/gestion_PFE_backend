import { AppDataSource } from '../configs/datasource';
import { Teacher } from '../entities/Teacher';
import { PageQuery, ResponseDTO } from '../dtos/genericDTOs';
import { Request, Response } from 'express';
import { Student } from '../entities/Student';
import { Project, ProjectStatus } from '../entities/Project';
import { User } from '../entities/User';
import { applyRelations } from 'typeorm-extension';
import { JwtRequest } from '../middleware/authJwt';
import { Parameter } from '../entities/Parameter';

const getTeachers = async (
  req: Request<{}, {}, {}, PageQuery>,
  res: Response<ResponseDTO<Teacher[]>>,
) => {
  const teacherRepository = AppDataSource.getRepository(Teacher);
  console.log(req.query.size);
  const teachers = await teacherRepository.findAndCount({
    take: parseInt(req.query.size),
    skip: parseInt(req.query.size) * (parseInt(req.query.page) - 1),
    relations: {
      user: true,
    },
  });
  res.status(200).send({ data: teachers[0] });
};

export const getTeachersUnpaged = async (
  req: Request,
  res: Response<ResponseDTO<Teacher[]>>,
) => {
  const teacherRepository = AppDataSource.getRepository(Teacher);
  console.log(req.query.size);
  const teachers = await teacherRepository.find({
    relations: {
      user: true,
    },
  });
  res.status(200).send({ data: teachers });
};

const getStudents = async (
  req: Request<{}, {}, {}, PageQuery>,
  res: Response<ResponseDTO<Student[]>>,
) => {
  const studentRepository = AppDataSource.getRepository(Student);
  debugger;
  const students = await studentRepository.findAndCount({
    take: parseInt(req.query.size),
    skip: parseInt(req.query.size) * (parseInt(req.query.page) - 1),
    relations: {
      user: true,
    },
  });
  res.status(200).send({ data: students[0] });
};

const deleteUser = async (
  req: Request<{ id: string }, {}, {}>,
  res: Response<ResponseDTO<string>>,
) => {
  const userRepository = AppDataSource.getRepository(User);
  await userRepository.delete(parseInt(req.params.id));
  res.status(200).send({ data: 'User has been deleted' });
};

const editUser = async (
  req: Request<{ id: string }, {}, User>,
  res: Response<ResponseDTO<string>>,
) => {
  const userRepository = AppDataSource.getRepository(User);
  const user = await userRepository.findOneOrFail({
    where: { id: parseInt(req.params.id) },
  });
  user.email = req.body.email;
  user.role = req.body.role;
  await userRepository.save(user);
  res.status(200).send({ data: 'User has been updated' });
};

const getProjects = async (
  req: Request<{}, {}, {}, PageQuery>,
  res: Response<ResponseDTO<Project[]>>,
) => {
  const projectRepository = AppDataSource.getRepository(Project);
  const projects = await projectRepository.findAndCount({
    take: parseInt(req.query.size),
    skip: parseInt(req.query.size) * (parseInt(req.query.page) - 1),
    relations: {
      proposedBy: true,
    },
  });
  res.status(200).send({ data: projects[0] });
};

const getPendingApprovalProjects = async (
  req: Request<{}, {}, {}, PageQuery>,
  res: Response<ResponseDTO<Project[]>>,
) => {
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

const approveProject = async (
  req: Request<{ id: string }, {}, {}>,
  res: Response<ResponseDTO<string>>,
) => {
  const projectRepository = AppDataSource.getRepository(Project);
  const project = await projectRepository.findOne({
    where: { id: parseInt(req.params.id) },
  });
  if (!project) {
    return res.status(404).send({ data: 'Project not found' });
  }
  project.status = ProjectStatus.APPROVED;
  await projectRepository.save(project);
  res.status(200).send({ data: 'Project has been approved' });
};

const rejectProject = async (
  req: Request<{ id: string }, {}, {}>,
  res: Response<ResponseDTO<string>>,
) => {
  const projectRepository = AppDataSource.getRepository(Project);
  const project = await projectRepository.findOneOrFail({
    where: { id: parseInt(req.params.id) },
  });
  project.status = ProjectStatus.REJECTED;
  await projectRepository.save(project);
  res.status(200).send({ data: 'Project has been rejected' });
};

export const updateParameters = async (
  req: JwtRequest<{}, Parameter>,
  res: Response<ResponseDTO<string>>,
) => {
  const parameterRepository = AppDataSource.getRepository(Parameter);

  try {
    const parameter = await parameterRepository.findOneOrFail({
      where: { year: req.body.year },
    });
    parameter.maxTeamSize = req.body.maxTeamSize;
    parameter.allowTeamCreation = req.body.allowTeamCreation;
    parameter.allowTeamJoining = req.body.allowTeamJoining;
    parameter.allowWishListCreation = req.body.allowWishListCreation;
    parameter.distributionMode = req.body.distributionMode;
    await parameterRepository.save(parameter);
    res.status(200).send({ data: 'Parameter has been updated' });
  } catch (e) {
    res.status(404).send({ data: 'Parameter not found' });
  }
};

export const getAllParameters = async (
  req: Request<{}, Parameter>,
  res: Response<ResponseDTO<Parameter[]>>,
) => {
  const parameterRepository = AppDataSource.getRepository(Parameter);
  const parameters = await parameterRepository.find();
  res.status(200).send({ data: parameters });
};

export const getMyParameter = async (
  req: JwtRequest<{}, Parameter>,
  res: Response<ResponseDTO<Parameter>>,
) => {
  const parameterRepository = AppDataSource.getRepository(Parameter);
  const parameter = await parameterRepository.findOneOrFail({
    where: { year: req.user.student.academicYear },
  });
  res.status(200).send({ data: parameter });
};

//TODO: add admin adding students using xml or something
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
