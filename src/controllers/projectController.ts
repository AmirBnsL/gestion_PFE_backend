import { Request, Response } from 'express';
import { AppDataSource } from '../configs/datasource';
import { Project, ProjectStatus } from '../entities/Project';
import { PageQuery, ResponseDTO } from '../dtos/genericDTOs';
import { JwtRequest } from '../middleware/authJwt';
import { ProjectDTORequest } from '../dtos/projectDTOS';

const getProjectOverview = async (
  req: Request<{ projectId: string }>,
  res: Response,
) => {
  const projectRepository = AppDataSource.getRepository(Project);
  const project = await projectRepository.findOneOrFail({
    where: { id: parseInt(req.params.projectId) },
  });
  res.status(200).send({ data: project });
};

const getApprovedProjects = async (
  req: Request<{}, {}, {}, PageQuery>,
  res: Response<ResponseDTO<Project[]>>,
) => {
  const projectRepository = AppDataSource.getRepository(Project);
  const projects = await projectRepository.findAndCount({
    take: parseInt(req.query.size),
    skip: parseInt(req.query.size) * (parseInt(req.query.page) - 1),
    where: { status: ProjectStatus.APPROVED },
  });
  res.status(200).send({ data: projects[0] });
};

//TODO: fix JWTrequest to use express's Request generics
const createProject = async (
  req: JwtRequest<{}, ProjectDTORequest>,
  res: Response,
) => {
  try {
    const teacher = req.user.teacher;

    const projectRepository = AppDataSource.getRepository(Project);
    const project = new Project();
    project.title = req.body.title;
    project.description = req.body.description;
    project.specialty = req.body.specialty;

    project.proposedBy = teacher;

    await projectRepository.save(project);
    res.status(201).send({ data: 'Project created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Internal server error' });
  }
};

export { getProjectOverview, getApprovedProjects, createProject };
