import { Project, ProjectStatus } from '../entities/Project';
import { AppDataSource } from '../configs/datasource';
import { JwtRequest } from '../middleware/authJwt';
import { Response } from 'express';
import { Teacher } from '../entities/Teacher';
import { SupervisorInvite } from '../entities/SupervisorInvite';

export const getTeacherProposedApprovedProjects = async (
  req: JwtRequest,
  res: Response,
) => {
  const teacher = req.user.teacher;
  const projectRepository = AppDataSource.getRepository(Project);
  const projects = await projectRepository.find({
    where: {
      proposedBy: { id: teacher.id },
      status: ProjectStatus.APPROVED,
    },
    relations: {
      supervisorInvites: { supervisor: { user: true } },
      proposedBy: true,
      supervisedBy: { user: true },
      teamJoinProjectRequests: { team: true },
      team: { teamLeader: true },
    },
  });
  res.status(200).send({ data: projects });
};

export const getTeacherSupervisedApprovedProjects = async (
  req: JwtRequest,
  res: Response,
) => {
  const teacherRepository = AppDataSource.getRepository(Teacher);

  const teacher = await teacherRepository.findOne({
    where: { id: req.user.teacher.id },
    relations: {
      supervisedProjects: {
        supervisorInvites: { supervisor: true },
        proposedBy: true,
        supervisedBy: { user: true },
        teamJoinProjectRequests: { team: true },
        team: { teamLeader: true },
      },
    },
  });

  if (!teacher) {
    return res.status(404).send({ data: 'Teacher not found' });
  }
  const projects = teacher.supervisedProjects;

  res.status(200).send({ data: projects });
};

export const getProjectSupervisionRequests = async (
  req: JwtRequest<{ projectId: string }>,
  res: Response,
) => {
  const projectRepository = AppDataSource.getRepository(Project);
  const projectSupervisionRequestRepository =
    AppDataSource.getRepository(SupervisorInvite);

  const supervisorInvites = await projectSupervisionRequestRepository.find({
    where: {
      project: {
        id: parseInt(req.params.projectId),
        status: ProjectStatus.APPROVED,
      },
      initiator: 'proposer',
    },
  });

  res.status(200).send({ data: supervisorInvites });
};

export const getTeachersSupervisionInvites = async (
  req: JwtRequest,
  res: Response,
) => {
  const teacherRepository = AppDataSource.getRepository(Teacher);
  const supervisorInviteRepository =
    AppDataSource.getRepository(SupervisorInvite);

  const teacher = await teacherRepository.findOne({
    where: { id: req.user.teacher.id },
    relations: {
      supervisorInvites: true,
    },
  });

  if (!teacher) {
    return res.status(404).send({ data: 'Teacher not found' });
  }

  const invites = await supervisorInviteRepository.find({
    where: {
      supervisor: { id: teacher.id },
      status: 'pending',
    },
    relations: { project: { proposedBy: { user: true } } },
  });

  res.status(200).send({ data: invites });
};

export const getMyAllProjects = async (req: JwtRequest, res: Response) => {
  const teacherRepository = AppDataSource.getRepository(Teacher);
  const projectRepository = AppDataSource.getRepository(Project);

  const teacher = await teacherRepository.findOne({
    where: { id: req.user.teacher.id },
    relations: {
      proposedProjects: true,
      supervisedProjects: true,
    },
  });

  if (!teacher) {
    return res.status(404).send({ data: 'Teacher not found' });
  }

  const projects = await projectRepository.find({
    where: [{ proposedBy: { id: teacher.id } }],
  });

  res.status(200).send({ data: projects });
};
