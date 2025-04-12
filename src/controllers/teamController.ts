import { AppDataSource } from '../configs/datasource';
import { Team } from '../entities/Team';
import { Request, Response } from 'express';
import { Project } from '../entities/Project';
import { EntityNotFoundError } from 'typeorm';
import { JwtRequest } from '../middleware/authJwt';
import { TeamMembership } from '../entities/TeamMemberships';
import { Parameter } from '../entities/Parameter';
import { Student } from '../entities/Student';
import { TeamInvite } from '../entities/TeamInvite';
import { User } from '../entities/User';
import { TeamJoinRequest } from '../entities/TeamJoinRequest';
import { ResourceNotFoundError } from '../errors/AppError';

interface TeamDTO {
  name: string;
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
      relations: { members: true },
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
  req: JwtRequest<{}, TeamDTO>,
  res: Response,
) => {
  try {
    const parameterRepository = AppDataSource.getRepository(Parameter);

    const user = req.user;
    const student = user.student;
    const parameters = await parameterRepository.findOneOrFail({
      where: { year: student.academicYear },
    });
    if (!parameters.allowTeamCreation) {
      return res.status(400).send({
        message: 'Team creation is not allowed for this academic year',
      });
    }

    const teamMembershipRepository =
      AppDataSource.getRepository(TeamMembership);
    const isStudentInTeam = await teamMembershipRepository.exists({
      where: { student: student },
    });

    if (isStudentInTeam) {
      return res.status(400).send({
        message: 'Student already has a team',
      });
    }

    const teamRepository = AppDataSource.getRepository(Team);

    const membership = new TeamMembership();

    const team = new Team();
    team.name = req.body.name;
    team.teamLeader = student;
    team.specialty = student.specialty;

    await teamRepository.save(team);

    membership.team = team;
    membership.student = student;
    membership.joinedAt = new Date();

    await teamMembershipRepository.save(membership);
    res.status(200).send({ data: 'Team created successfully' });
  } catch (e) {
    res.status(500).send({ message: e });
  }
};

//done by team leader
export const sendInvite = async (
  req: JwtRequest<{ email: string }>,
  res: Response,
) => {
  console.log('email : ' + req.body.email);

  debugger;
  const studentRepository = AppDataSource.getRepository(Student);
  const teamInviteRepository = AppDataSource.getRepository(TeamInvite);
  const userRepository = AppDataSource.getRepository(User);
  try {
    const senderStudent = await studentRepository.findOneOrFail({
      where: { id: req.user.student.id },
      relations: {
        teamMembership: { team: { teamLeader: true, members: true } },
      },
    });

    const team = senderStudent.teamMembership.team;
    if (!team) {
      return res.status(404).send({ data: 'Team not found' });
    }
    const isTeamLeader = team.teamLeader.id === senderStudent.id;

    if (!isTeamLeader) {
      return res.status(403).send({ data: 'Student is not team leader' });
    }

    const user = await userRepository.findOneOrFail({
      where: {
        email: req.params.email,
      },
      relations: { student: { teamMembership: true } },
    });
    const student = user.student;

    const existingInvite = await teamInviteRepository.findOne({
      where: {
        team: { id: team.id },
        toUser: { id: student.id },
        status: 'pending', // Check only for active/pending invites
      },
    });

    if (existingInvite) {
      return res.status(400).send({ data: 'Invite already sent' });
    }

    if (student.academicYear != senderStudent.academicYear) {
      return res.status(400).send({
        data: 'Student is not in the same academic year',
      });
    }

    const isStudentInTeam = team.members.some(
      member => member.id === student.id,
    );

    if (isStudentInTeam) {
      return res.status(400).send({ data: 'Student already in the team' });
    }

    if (student.teamMembership) {
      return res.status(400).send({ data: 'Student already has a team' });
    }

    const invite = new TeamInvite();
    invite.team = team;
    invite.toUser = student;
    invite.createdAt = new Date();
    invite.status = 'pending';

    await teamInviteRepository.save(invite);

    res.status(200).send({ data: 'Invite sent successfully' });
  } catch (e) {
    res.status(500).send({ data: e });
  }
};

export const requestTeam = async (
  req: JwtRequest<{ teamId: string }>,
  res: Response,
) => {
  const parameterRepository = AppDataSource.getRepository(Parameter);
  const teamRepository = AppDataSource.getRepository(Team);
  const teamJoinRequestRepository =
    AppDataSource.getRepository(TeamJoinRequest);

  try {
    const parameter = await parameterRepository.findOneOrFail({
      where: { year: req.user.student.academicYear },
    });

    const student = req.user.student;

    if (student.teamMembership) {
      return { status: 400, message: 'Student already has a team' };
    }

    const team = await teamRepository.findOneOrFail({
      where: { id: parseInt(req.params.teamId) },
      relations: { members: true },
    });

    const existingInvite = await teamJoinRequestRepository.findOne({
      where: {
        team: { id: team.id },
        fromUser: { id: student.id },
        status: 'pending', // Check only for active/pending invites
      },
    });

    if (existingInvite) {
      return res.status(400).send({ data: 'Request already sent' });
    }

    if (team.members.some(member => member.id === student.id)) {
      res.status(404).send({ data: 'Student already in this team' });
    }

    if (team.members.length >= parameter.maxTeamSize) {
      res.status(400).send({ data: 'Team is full' });
    }
    if (student.specialty != team.specialty) {
      res.status(400).send({ data: 'Specialty mismatch' });
    }

    const teamJoinRequest = new TeamJoinRequest();
    teamJoinRequest.team = team;
    teamJoinRequest.fromUser = student;
    teamJoinRequest.status = 'pending';
    teamJoinRequest.createdAt = new Date();

    await teamJoinRequestRepository.save(teamJoinRequest);

    res.status(200).send({ data: 'Request sent successfully' });
  } catch (e) {
    return { status: 500, message: e };
  }
};

//done by students
export const acceptInvite = async (
  req: JwtRequest<{ teamId: string }>,
  res: Response,
) => {
  const teamInviteRepository = AppDataSource.getRepository(TeamInvite);
  const teamMembershipRepository = AppDataSource.getRepository(TeamMembership);
  const parameterRepository = AppDataSource.getRepository(Parameter);
  try {
    const user = req.user;

    const parameter = await parameterRepository.findOneOrFail({
      where: { year: user.student.academicYear },
    });

    const invite = await teamInviteRepository.findOneOrFail({
      where: {
        team: { id: parseInt(req.params.teamId) },
        status: 'pending',
        toUser: { id: user.student.id },
      },
      relations: { toUser: true, team: { members: true } },
    });
    console.log(invite);

    if (invite.status !== 'pending') {
      return res.status(400).send({ data: 'Invite is not pending' });
    }
    console.log('invite status : ' + invite.status);

    if (invite.team.members.length >= parameter.maxTeamSize) {
      return res.status(400).send({ data: 'Team is full' });
    }

    invite.status = 'accepted';
    await teamInviteRepository.save(invite);

    const membership = new TeamMembership();
    membership.student = invite.toUser;
    membership.team = invite.team;
    membership.joinedAt = new Date();

    await teamMembershipRepository.save(membership);

    res.status(200).send({ data: 'Invite accepted successfully' });
  } catch (e) {
    if (e instanceof EntityNotFoundError) {
      res.status(400).send({ data: 'Team invite not found' });
    } else {
      res.status(500).send({ data: 'Internal server error' });
    }
  }
};

//team leader accepts request from a student
export const acceptJoinRequest = async (
  req: JwtRequest<{ studentId: string }>,
  res: Response,
) => {
  const teamJoinRequestRepository =
    AppDataSource.getRepository(TeamJoinRequest);
  const teamMembershipRepository = AppDataSource.getRepository(TeamMembership);
  const parameterRepository = AppDataSource.getRepository(Parameter);
  const teamRepository = AppDataSource.getRepository(Team);
  try {
    const user = req.user;
    const team = await teamRepository.findOneOrFail({
      where: { teamLeader: { id: user.student.id } },
      relations: { members: true },
    });

    const parameter = await parameterRepository.findOneOrFail({
      where: { year: user.student.academicYear },
    });
    console.log('student : ' + req.params.studentId);
    const joinRequest = await teamJoinRequestRepository.findOneOrFail({
      where: {
        team: { id: team?.id },
        status: 'pending',
        fromUser: { id: parseInt(req.params.studentId) },
      },
      relations: {
        fromUser: { teamMembership: { team: true } },
        team: { members: true },
      },
    });

    if (joinRequest.fromUser.teamMembership.team) {
      return res.status(400).send({ data: 'Student already has a team' });
    }

    if (joinRequest.status !== 'pending') {
      return res.status(400).send({ data: 'Request is not pending' });
    }

    if (joinRequest.team.members.length >= parameter.maxTeamSize) {
      return res.status(400).send({ data: 'Team is full' });
    }

    joinRequest.status = 'accepted';
    await teamJoinRequestRepository.save(joinRequest);

    const membership = new TeamMembership();
    membership.student = joinRequest.fromUser;
    membership.team = joinRequest.team;
    membership.joinedAt = new Date();

    await teamMembershipRepository.save(membership);

    res.status(200).send({ data: 'Join request accepted successfully' });
  } catch (e) {
    if (e instanceof EntityNotFoundError) {
      res.status(400).send({ data: e.message });
    } else {
      res.status(500).send({ data: e });
    }
  }
};

export const joinTeam = async (
  req: Request<{ teamId: string }>,
  res: Response,
) => {};

export const leaveTeam = async (
  req: Request<{ teamId: string }>,
  res: Response,
) => {};
