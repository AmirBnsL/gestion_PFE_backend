import { Request, Response } from 'express';
import { AppDataSource } from '../configs/datasource';
import { Project, ProjectStatus } from '../entities/Project';
import { PageQuery, ResponseDTO } from '../dtos/genericDTOs';
import { JwtRequest } from '../middleware/authJwt';
import { ProjectDTORequest } from '../dtos/projectDTOS';
import { Team } from '../entities/Team';
import { EntityNotFoundError } from 'typeorm';

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

//constraints : project specialty must be the same as team specialty
const assignProjectToTeam = async (
  req: Request<{ projectId: string; teamId: string }>,
  res: Response,
) => {
  const projectRepository = AppDataSource.getRepository(Project);
  const teamRepository = AppDataSource.getRepository(Team);
  try {
    const project = await projectRepository.findOneOrFail({
      where: { id: parseInt(req.params.projectId) },
    });
    const team = await teamRepository.findOneOrFail({
      where: { id: parseInt(req.params.teamId) },
      relations: ['students'],
    });
    //TODO: think of adding specialty to team entity
    if (project.specialty !== team.students[0].specialty) {
      return res.status(400).send({ message: 'Specialty mismatch' });
    }
    project.team.push(team);
  } catch (error) {
    if (error instanceof EntityNotFoundError) {
      res.status(404).send({ message: 'Project not found' });
    }
  }
};

export {
  assignProjectToTeam,
  getProjectOverview,
  getApprovedProjects,
  createProject,
};
