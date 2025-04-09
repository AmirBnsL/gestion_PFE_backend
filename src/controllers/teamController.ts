import { AppDataSource } from '../configs/datasource';
import { Team } from '../entities/Team';
import { Request, Response } from 'express';
import { Project } from '../entities/Project';
import { EntityNotFoundError } from 'typeorm';
import { Student } from '../entities/Student';

interface TeamDTO {
  id: number;
  name: string;
  project: Project;
  students: Student[];
}

export const getTeamByProjectId = async (
  req: Request<
    {
      projectId: string;
    },
    {},
    {}
  >,
  res: Response,
) => {
  try {
    console.log('project id :' + req.params.projectId);
    const teamRepository = AppDataSource.getRepository(Team);

    const projectRepository = AppDataSource.getRepository(Project);
    const project = await projectRepository.findOneOrFail({
      where: { id: parseInt(req.params.projectId) },
    });
    const team = await teamRepository.findOneOrFail({
      where: { project: { id: project.id } },
      relations: { students: true },
    });
    res.status(200).send({ data: team });
  } catch (e) {
    console.log(e);
    if (e instanceof EntityNotFoundError) {
      res.status(404).send({ message: 'Team not found' });
    } else {
      res.status(500).send({ message: 'Internal server error' });
    }
  }
};

//TODO: THIS IS GONNA BE DONE THIS SPRINT
export const createTeam = async (
  req: Request<{}, {}, TeamDTO>,
  res: Response,
) => {};

//done by team leader
export const sendInvite = async (
  req: Request<{ teamId: string }>,
  res: Response,
) => {};

//done by team leader

export const acceptInvite = async (
  req: Request<{ teamId: string }>,
  res: Response,
) => {};

export const joinTeam = async (
  req: Request<{ teamId: string }>,
  res: Response,
) => {};

export const leaveTeam = async (
  req: Request<{ teamId: string }>,
  res: Response,
) => {};
