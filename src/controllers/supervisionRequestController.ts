import { Request, Response } from 'express';

import {
  SupervisionDirection,
  SuperviseTeamRequest,
  SupervisionStatus,
} from '../entities/SuperviseTeamRequest';
import { Team } from '../entities/Team';
import { Teacher } from '../entities/Teacher';
import { Project } from '../entities/Project';
import { AppDataSource } from '../configs/datasource';
import { JwtRequest } from '../middleware/authJwt';

export async function createSupervisionRequest(
  req: JwtRequest<
    {},
    {
      teamId: number;
      supervisorId: number;
      projectId: number;
      direction: SupervisionDirection;
    }
  >,
  res: Response,
) {
  const repository = AppDataSource.getRepository(SuperviseTeamRequest);
  const { teamId, supervisorId, projectId, direction } = req.body;
  if (!teamId || !supervisorId || !projectId || !direction) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  const existing = await repository.findOne({
    where: {
      team: { id: teamId },
      supervisor: { id: supervisorId },
      project: { id: projectId },
      status: SupervisionStatus.PENDING,
    },
  });
  if (existing) {
    return res.status(409).json({ error: 'Request already exists' });
  }

  const teamRepo = AppDataSource.getRepository(Team);
  const supervisorRepo = AppDataSource.getRepository(Teacher);
  const projectRepo = AppDataSource.getRepository(Project);

  const team = await teamRepo.findOneByOrFail({ id: teamId });
  const supervisor = await supervisorRepo.findOneByOrFail({ id: supervisorId });
  const project = await projectRepo.findOneOrFail({
    where: { id: projectId },
    relations: ['proposedBy'],
  });

  const projectProposer = project.proposedBy;
  if (!projectProposer) {
    return res.status(400).json({ error: 'Project does not have a proposer' });
  }

  const reqObj = repository.create({
    team,
    supervisor,
    project,
    direction,
    status: SupervisionStatus.PENDING,
    projectProposer,
  });
  await repository.save(reqObj);
  res.status(201).json(reqObj);
}

export async function updateSupervisionRequestStatus(
  req: JwtRequest,
  res: Response,
) {
  const repository = AppDataSource.getRepository(SuperviseTeamRequest);
  const { id } = req.params;
  const { status, decidedBy } = req.body;

  const reqObj = await repository.findOneOrFail({
    where: { id: Number(id) },
    relations: [
      'team',
      'team.teamLeader',
      'supervisor',
      'supervisor.user',
      'project',
      'projectProposer',
      'project.proposedBy',
    ],
  });

  if (
    reqObj.status !== SupervisionStatus.PENDING &&
    !(
      status === SupervisionStatus.VALIDATED_BY_PROPOSER &&
      reqObj.status === SupervisionStatus.ACCEPTED
    )
  ) {
    return res.status(400).json({ error: 'Invalid status transition' });
  }

  if (
    status === SupervisionStatus.VALIDATED_BY_PROPOSER &&
    (!req.user ||
      !reqObj.projectProposer ||
      req.user.teacher.id !== reqObj.projectProposer.id)
  ) {
    return res
      .status(403)
      .json({ error: 'Only project proposer can validate' });
  }

  // Accept/reject logic
  if (
    [SupervisionStatus.ACCEPTED, SupervisionStatus.REJECTED].includes(status)
  ) {
    if (reqObj.direction === SupervisionDirection.SUPERVISOR_TO_TEAM) {
      // Only team leader can accept if pending
      if (
        status === SupervisionStatus.ACCEPTED &&
        (!reqObj.team.teamLeader ||
          !reqObj.team.teamLeader.user ||
          req.user.id !== reqObj.team.teamLeader.user.id)
      ) {
        return res
          .status(403)
          .json({ error: 'Only team leader can accept this request' });
      }
    } else if (reqObj.direction === SupervisionDirection.TEAM_TO_SUPERVISOR) {
      // Only supervisor can accept if pending
      if (
        status === SupervisionStatus.ACCEPTED &&
        (!reqObj.supervisor.user || req.user.id !== reqObj.supervisor.user.id)
      ) {
        return res
          .status(403)
          .json({ error: 'Only supervisor can accept this request' });
      }
    }
    // Optionally, you can keep the original role check for reject
    if (
      status === SupervisionStatus.REJECTED &&
      req.user.role !== 'teacher' &&
      req.user.role !== 'student'
    ) {
      return res
        .status(403)
        .json({ error: 'Only supervisor or team can reject' });
    }
  }

  reqObj.status = status;
  reqObj.decidedBy = decidedBy || req.user.email;
  reqObj.decidedAt = new Date();
  await repository.save(reqObj);
  res.json(reqObj);
}

export async function getSupervisionRequestById(req: Request, res: Response) {
  const repository = AppDataSource.getRepository(SuperviseTeamRequest);
  const { id } = req.params;
  const reqObj = await repository.findOneOrFail({
    where: { id: Number(id) },
    relations: ['team', 'supervisor', 'project', 'projectProposer'],
  });
  res.json(reqObj);
}

export async function listSupervisionRequests(req: Request, res: Response) {
  const repository = AppDataSource.getRepository(SuperviseTeamRequest);
  const { teamId, supervisorId, projectId, status } = req.query;
  const where: any = {};
  if (teamId) where.team = { id: Number(teamId) };
  if (supervisorId) where.supervisor = { id: Number(supervisorId) };
  if (projectId) where.project = { id: Number(projectId) };
  if (status) where.status = status;
  const results = await repository.find({
    where,
    relations: ['team', 'supervisor', 'project', 'projectProposer'],
  });
  res.json(results);
}
