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
      supervisedProjects: true,
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
  });

  res.status(200).send({ data: invites });
};
