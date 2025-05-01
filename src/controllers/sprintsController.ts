import { JwtRequest } from '../middleware/authJwt';
import { Request, Response } from 'express';
import { AppDataSource } from '../configs/datasource';
import { Sprint, SprintStatus } from '../entities/Sprint';
import { can } from './projectController';
import { Project } from '../entities/Project';
import { Team } from '../entities/Team';

export const createSprint = async (
  req: JwtRequest<
    {},
    {
      startDate: Date;
      endDate: Date;
      description: string;
      title: string;
      projectId: number;
      teamId: number;
      status: SprintStatus;
    }
  >,
  res: Response,
) => {
  const sprintRepository = AppDataSource.getRepository(Sprint);
  const projectRepository = AppDataSource.getRepository(Project);
  const teamRepository = AppDataSource.getRepository(Team);

  try {
    const project = await projectRepository.findOne({
      where: {
        id: req.body.projectId,
      },
      relations: {
        team: { teamLeader: true },
      },
    });
    if (!project) {
      res.status(404).json({ data: 'project not found or not team leader' });
      return;
    }
    const team = await teamRepository.findOne({
      where: {
        id: req.body.teamId,
      },
      relations: {
        teamLeader: true,
      },
    });
    if (!team) {
      res.status(404).json({ data: 'team not found' });
      return;
    }

    can(req.user, res).lead(team);
    const sprint = new Sprint();
    sprint.team = team;
    sprint.project = project;
    sprint.endDate = req.body.endDate;
    sprint.startDate = req.body.startDate;
    sprint.description = req.body.description;
    sprint.title = req.body.title;
    sprint.status = req.body.status;

    await sprintRepository.save(sprint);
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: 'Error creating sprint' });
  }
};

export const getSprints = async (
  req: JwtRequest<{ projectId: string; teamId: string }>,
  res: Response,
) => {
  const sprintRepository = AppDataSource.getRepository(Sprint);

  try {
    const sprints = await sprintRepository.find({
      where: {
        project: { id: parseInt(req.params.projectId) },
        team: { id: parseInt(req.params.teamId) },
      },
      relations: ['project', 'team'],
    });

    if (!sprints || sprints.length === 0) {
      return res.status(404).json({ message: 'No sprints found' });
    }

    res.status(200).json({ data: sprints });
  } catch (e) {
    res.status(500).json({ message: 'Error getting sprints' });
    return;
  }
};

export const getMySprints = async (req: JwtRequest, res: Response) => {
  const sprintRepository = AppDataSource.getRepository(Sprint);
  const teamRepository = AppDataSource.getRepository(Team);

  try {
    const studentId = req.user?.student?.id;

    if (!studentId) {
      return res.status(400).json({ message: 'Student ID not found in token' });
    }

    // Find the team where the student is a member
    const team = await teamRepository.findOne({
      where: {
        members: {
          id: studentId, // Filter by student ID within the members relation
        },
      },
      relations: ['members'], // Ensure members relation is loaded if needed elsewhere
    });

    if (!team) {
      return res
        .status(404)
        .json({ message: 'Team not found for this student' });
    }

    // Now use the found team's ID to get the sprints
    const sprints = await sprintRepository.find({
      where: {
        team: { id: team.id },
      },
      relations: ['project', 'team'],
    });

    if (!sprints || sprints.length === 0) {
      return res
        .status(404)
        .json({ message: 'No sprints found for this team' });
    }

    res.status(200).json({ data: sprints });
  } catch (e) {
    console.error('Error getting sprints:', e); // Log the actual error
    res.status(500).json({ message: 'Error getting sprints' });
  }
};
