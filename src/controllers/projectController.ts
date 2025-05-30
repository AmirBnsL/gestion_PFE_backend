import { Request, Response } from 'express';
import { AppDataSource } from '../configs/datasource';
import { Project, ProjectStatus } from '../entities/Project';
import { PageQuery, ResponseDTO } from '../dtos/genericDTOs';
import { JwtRequest } from '../middleware/authJwt';
import { ProjectDTORequest } from '../dtos/projectDTOS';
import { Team } from '../entities/Team';
import { EntityNotFoundError } from 'typeorm';
import { SupervisorInvite } from '../entities/SupervisorInvite';
import { Teacher } from '../entities/Teacher';
import { Student } from '../entities/Student';
import { TeamJoinProjectRequest } from '../entities/TeamJoinProjectRequest';
import { FileUpload } from '../entities/FileUpload';
import path from 'path';
import { AcademicYear } from '../enums/AcademicYear';
import { Parameter } from '../entities/Parameter';

const getProjectOverview = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  const projectRepository = AppDataSource.getRepository(Project);
  const project = await projectRepository.findOneOrFail({
    where: { id: parseInt(req.params.id) },
    relations: { proposedBy: true, supervisedBy: true, team: true },
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
    project.academicYear = req.body.academicYear;

    project.proposedBy = teacher;
    project.supervisedBy = [];
    project.supervisedBy.push(teacher);

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
    if (project.specialty !== team.members[0].student.specialty) {
      return res.status(400).send({ message: 'Specialty mismatch' });
    }
    project.team.push(team);
  } catch (error) {
    if (error instanceof EntityNotFoundError) {
      res.status(404).send({ message: 'Project not found' });
    }
  }
};

const createAndSaveSupervisorInvite = async (
  project: Project,
  teacher: Teacher,
  initiator: 'teacher' | 'proposer',
) => {
  const supervisorInviteRepository =
    AppDataSource.getRepository(SupervisorInvite);

  const request = new SupervisorInvite();
  request.project = project;
  request.supervisor = teacher;
  request.status = 'pending';
  request.initiator = initiator;

  await supervisorInviteRepository.save(request);
};

export const sendProjectSupervisionByTeacher = async (
  req: JwtRequest<{ teacherId: string; projectId: string }>,
  res: Response,
) => {
  const projectRepository = AppDataSource.getRepository(Project);

  const teacherRepository = AppDataSource.getRepository(Teacher);

  try {
    const user = req.user;

    const proposer = await teacherRepository.findOne({
      where: { user: { id: user.id } },
    });
    if (!proposer) {
      return res.status(404).send({ message: 'Proposer not found' });
    }

    const project = await projectRepository.findOne({
      where: {
        id: parseInt(req.params.projectId),
        proposedBy: { id: proposer.id },
      },
      relations: ['proposedBy'],
    });

    if (!project) {
      return res.status(404).send({ message: 'Project not found' });
    }

    can(user, res).propose(project);

    const teacher = await teacherRepository.findOneOrFail({
      where: { id: parseInt(req.params.teacherId) },
      relations: ['supervisedProjects'],
    });

    if (teacher.supervisedProjects) {
      for (const supervisedProject of teacher.supervisedProjects) {
        if (supervisedProject.id === project.id) {
          return res
            .status(400)
            .send({ message: 'Teacher is already supervising this project' });
        }
      }
    }

    await createAndSaveSupervisorInvite(project, teacher, 'proposer');
    res.status(201).send({ message: 'Supervision invite sent successfully' });
  } catch (e) {
    console.error(e);
    res.status(500).send({ message: e });
  }
};

export const sendProjectSupervisionByProject = async (
  req: JwtRequest<{ projectId: string }>,
  res: Response,
) => {
  const projectRepository = AppDataSource.getRepository(Project);
  const supervisorInviteRepository =
    AppDataSource.getRepository(SupervisorInvite);
  const teacherRepository = AppDataSource.getRepository(Teacher);

  try {
    const user = req.user;
    const teacher = await teacherRepository.findOneOrFail({
      where: { id: user.teacher.id },
      relations: ['supervisedProjects'],
    });

    if (teacher.supervisedProjects) {
      for (const project of teacher.supervisedProjects) {
        if (project.id === parseInt(req.params.projectId)) {
          return res
            .status(400)
            .send({ message: 'Already supervising this project' });
        }
      }
    }

    const project = await projectRepository.findOneOrFail({
      where: { id: parseInt(req.params.projectId) },
    });

    const request = new SupervisorInvite();
    request.project = project;
    request.supervisor = teacher;
    request.status = 'pending';
    request.initiator = 'teacher';

    await supervisorInviteRepository.save(request);
    res.status(201).send({ message: 'Supervision request sent successfully' });
  } catch (e) {
    console.error(e);
    res.status(500).send({ message: 'Internal server error' });
  }
};

export const acceptProjectSupervisionInviteAsTeacher = async (
  req: JwtRequest<{ requestId: string }>,
  res: Response,
) => {
  await acceptProjectSupervisionRequest(req, res, 'proposer');
};

export const rejectProjectSupervisionInviteAsTeacher = async (
  req: JwtRequest<{ requestId: string }>,
  res: Response,
) => {
  const supervisorInviteRepository =
    AppDataSource.getRepository(SupervisorInvite);
  try {
    const request = await supervisorInviteRepository.findOne({
      where: { id: parseInt(req.params.requestId), status: 'pending' },
      relations: ['project', 'supervisor'],
    });

    if (!request) {
      return res.status(404).send({ message: 'Request not found' });
    }

    request.status = 'declined';
    await supervisorInviteRepository.save(request);

    res.status(200).send({ message: 'Request declined successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Internal server error' });
  }
};

export const acceptProjectSupervisionInviteAsProposer = async (
  req: JwtRequest<{ requestId: string }>,
  res: Response,
) => {
  await acceptProjectSupervisionRequest(req, res, 'teacher');
};

const acceptProjectSupervisionRequest = async (
  req: JwtRequest<{ requestId: string }>,
  res: Response,
  initiator: 'teacher' | 'proposer',
) => {
  const supervisorInviteRepository =
    AppDataSource.getRepository(SupervisorInvite);
  const teacherRepository = AppDataSource.getRepository(Teacher);
  const projectRepository = AppDataSource.getRepository(Project);

  try {
    const request = await supervisorInviteRepository.findOne({
      where: [
        {
          id: parseInt(req.params.requestId),
          status: 'pending',
          initiator: initiator,
        },
        {},
      ],
      relations: ['project', 'supervisor'],
    });

    if (!request) {
      return res.status(404).send({ message: 'Request not found' });
    }

    request.status = 'accepted';

    const project = await projectRepository.findOne({
      where: { id: request.project.id },
      relations: ['supervisedBy'],
    });

    if (initiator === 'teacher') {
      if (project) can(req.user.teacher, res).propose(project);
    }

    if (!project) {
      return res.status(404).send({ message: 'Project not found' });
    }

    const teacher = await teacherRepository.findOne({
      where: { id: request.supervisor.id },
      relations: ['supervisedProjects'],
    });

    if (!teacher) {
      return res.status(404).send({ message: 'Teacher not found' });
    }
    project.supervisedBy = project.supervisedBy || [];
    teacher.supervisedProjects = teacher.supervisedProjects || [];

    // Optional: check if already supervising
    if (!project.supervisedBy.find(t => t.id === teacher.id)) {
      project.supervisedBy.push(teacher);
    }

    if (!teacher.supervisedProjects.find(p => p.id === project.id)) {
      teacher.supervisedProjects.push(project);
    }

    await projectRepository.save(project);
    await teacherRepository.save(teacher);
    await supervisorInviteRepository.save(request);

    res.status(200).send({ message: 'Request accepted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Internal server error' });
  }
};

export const sendTeamProjectRequest = async (
  req: JwtRequest<{ projectId: string }>,
  res: Response,
) => {
  const projectRepository = AppDataSource.getRepository(Project);
  const studentRepository = AppDataSource.getRepository(Student);
  const teamJoinProjectRequestRepository = AppDataSource.getRepository(
    TeamJoinProjectRequest,
  );
  try {
    const user = req.user;
    const student = await studentRepository.findOne({
      where: { user: { id: user.id } },
      relations: {
        teamMembership: { team: { teamLeader: true, project: true } },
      },
    });
    if (!student) {
      return res.status(404).send({ message: 'Student not found' });
    }

    try {
      can(user, res).lead(student.teamMembership.team);
    } catch (e) {
      return; // Stops execution if forbidden
    }

    if (student.teamMembership.team.project) {
      return res.status(400).send({ message: 'Team already has a project' });
    }

    const project = await projectRepository.findOne({
      where: { id: parseInt(req.params.projectId) },
      relations: ['team'],
    });
    if (!project) {
      return res.status(404).send({ message: 'Project not found' });
    }
    const teamJoinProjectRequest = new TeamJoinProjectRequest();
    teamJoinProjectRequest.project = project;
    teamJoinProjectRequest.team = student.teamMembership.team;
    teamJoinProjectRequest.status = 'pending';
    teamJoinProjectRequest.initiator = 'student';

    await teamJoinProjectRequestRepository.save(teamJoinProjectRequest);
    res.status(200).send({ message: 'Request sent successfully' });
  } catch (e) {
    console.error(e);
    res.status(500).send({ message: 'Internal server error' });
  }
};

export const declineTeamProjectRequest = async (
  req: JwtRequest<{ requestId: string }>,
  res: Response,
) => {
  const teamJoinProjectRequestRepository = AppDataSource.getRepository(
    TeamJoinProjectRequest,
  );
  try {
    const user = req.user;

    const request = await teamJoinProjectRequestRepository.findOne({
      where: { id: parseInt(req.params.requestId), status: 'pending' },
      relations: { project: { proposedBy: true } },
    });

    if (!request) {
      return res.status(404).send({ message: 'Request not found' });
    }

    try {
      can(user.teacher, res).propose(request.project);
    } catch (e) {
      return; // Stops execution if forbidden
    }

    request.status = 'declined';
    await teamJoinProjectRequestRepository.save(request);

    res.status(200).send({ message: 'Request declined successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Internal server error' });
  }
};

export const acceptTeamProjectRequest = async (
  req: JwtRequest<{ requestId: string }>,
  res: Response,
) => {
  const teamJoinProjectRequestRepository = AppDataSource.getRepository(
    TeamJoinProjectRequest,
  );
  const projectRepository = AppDataSource.getRepository(Project);
  const teamRepository = AppDataSource.getRepository(Team);
  try {
    const user = req.user;

    const request = await teamJoinProjectRequestRepository.findOne({
      where: { id: parseInt(req.params.requestId), status: 'pending' },
      relations: { project: { proposedBy: true }, team: true },
    });

    if (!request) {
      return res.status(404).send({ message: 'Request not found' });
    }

    try {
      can(user, res).propose(request.project);
    } catch (e) {
      return; // Stops execution if forbidden
    }

    request.status = 'accepted';
    await teamJoinProjectRequestRepository.save(request);

    const project = await projectRepository.findOneOrFail({
      where: { id: request.project.id },
      relations: ['team'],
    });

    const team = await teamRepository.findOneOrFail({
      where: { id: request.team.id },
      relations: { members: true },
    });
    team.project = project;
    project.team.push(team);
    await projectRepository.save(project);
    await teamRepository.save(team);

    res.status(200).send({ message: 'Request accepted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Internal server error' });
  }
};

export const can = (user: any, res: Response) => ({
  propose: (project: Project): void => {
    if (user?.teacher?.id !== project.proposedBy?.id) {
      res
        .status(403)
        .send({ message: 'You are not the proposer of this project' });
      throw new Error('Forbidden');
    }
  },
  lead: (team: Team): void => {
    if (user?.student?.id !== team.teamLeader?.id) {
      res.status(403).send({ message: 'You are not the leader of this team' });
      throw new Error('Forbidden');
    }
  },
});

export const getTeamJoinProjectRequestsForTeam = async (
  req: JwtRequest,
  res: Response,
) => {
  const teamJoinProjectRequestRepository = AppDataSource.getRepository(
    TeamJoinProjectRequest,
  );
  const studentRepository = AppDataSource.getRepository(Student);

  try {
    const user = req.user;
    const student = await studentRepository.findOne({
      where: { user: { id: user.id } },
      relations: { teamMembership: { team: true } },
    });
    if (!student) {
      return res.status(404).send({ message: 'Student not found' });
    }

    try {
      can(student, res).lead(student.teamMembership.team);
    } catch (e) {
      return; // Stops execution if forbidden
    }

    const requests = await teamJoinProjectRequestRepository.find({
      where: { team: student.teamMembership.team },
      relations: ['project', 'team'],
    });

    return res.status(200).send({ data: requests });
  } catch (error) {
    console.error(error);
    throw new Error('Internal server error');
  }
};

export const getTeamJoinProjectRequestsForProject = async (
  req: JwtRequest<{ projectId: string }>,
  res: Response,
) => {
  const projectRepository = AppDataSource.getRepository(Project);

  try {
    const user = req.user;
    const project = await projectRepository.findOne({
      where: { id: parseInt(req.params.projectId) },
      relations: {
        teamJoinProjectRequests: { project: true, team: true },
        proposedBy: true,
      },
    });
    if (!project) {
      return res.status(404).send({ message: 'project not found' });
    }

    try {
      can(user, res).propose(project);
    } catch (e) {
      return; // Stops execution if forbidden
    }

    const requests = project.teamJoinProjectRequests;

    return res.status(200).send({ data: requests });
  } catch (error) {
    console.error(error);
    throw new Error('Internal server error');
  }
};

export const uploadProjectFile = async (
  req: JwtRequest<{ projectId: string }>,
  res: Response,
) => {
  const projectRepository = AppDataSource.getRepository(Project);
  const fileUploadRepository = AppDataSource.getRepository(FileUpload);
  try {
    const user = req.user;
    const project = await projectRepository.findOneOrFail({
      where: { id: parseInt(req.params.projectId) },
      relations: ['proposedBy', 'files'],
    });
    if (!project) {
      return res.status(404).send({ message: 'Project not found' });
    }
    try {
      can(user, res).propose(project);
    } catch (e) {
      return; // Stops execution if forbidden
    }
    const files = req.files;
    if (!files) {
      return res.status(400).send({ message: 'File not found' });
    }

    if (!Array.isArray(files)) {
      return res.status(400).send({ message: 'Invalid file format' });
    }
    for (const file of files) {
      const fileUpload = new FileUpload();
      fileUpload.name = file.filename;
      fileUpload.link = file.path;
      fileUpload.project = project;
      project.files.push(fileUpload);
      await fileUploadRepository.save(fileUpload);
      await projectRepository.save(project);
    }
    res.status(200).send({ message: 'File uploaded successfully' });
  } catch (e) {
    console.error(e);
    return res.status(500).send({ message: 'Internal server error' });
  }
};

export const getProjectFilesLink = async (
  req: JwtRequest<{ projectId: string }>,
  res: Response,
) => {
  const projectRepository = AppDataSource.getRepository(Project);
  const fileUploadRepository = AppDataSource.getRepository(FileUpload);
  try {
    const project = await projectRepository.findOneOrFail({
      where: { id: parseInt(req.params.projectId) },
      relations: ['files'],
    });
    if (!project) {
      return res.status(404).send({ message: 'Project not found' });
    }
    const files = project.files;
    if (!files || files.length === 0) {
      return res.status(404).send({ message: 'No files found' });
    }
    const fileLinks = files.map(file => ({
      name: file.name,
      id: file.id,
    }));
    res.status(200).send({ data: fileLinks });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: 'Internal server error' });
  }
};

export const downloadFileById = async (
  req: JwtRequest<{ fileId: string }>,
  res: Response,
) => {
  const fileUploadRepository = AppDataSource.getRepository(FileUpload);

  try {
    const file = await fileUploadRepository.findOneOrFail({
      where: { id: parseInt(req.params.fileId) },
    });

    if (!file) {
      return res.status(404).send({ message: 'File not found' });
    }

    const filePath = path.resolve(file.link);

    res.download(filePath, file.name, err => {
      if (err) {
        console.error('❌ Error sending file:', err);
        res.status(500).send({ message: 'Error downloading file' });
      } else {
        console.log('✅ File sent successfully!');
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: 'Internal server error' });
  }
};

const distributeProject = async (
  req: Request<{ year: AcademicYear }>,
  res: Response,
) => {
  try {
    const year = req.params.year;
    const parameterRepository = AppDataSource.getRepository(Parameter);

    const parameter = await parameterRepository.findOne({
      where: { year: year },
    });
    if (!parameter) {
      return res
        .status(404)
        .send({ message: 'Parameter not found for this year' });
    }

    if (parameter.distributionMode !== 'automatic') {
      return res
        .status(400)
        .send({ message: 'Distribution mode is not automatic' });
    }

    const projectRepository = AppDataSource.getRepository(Project);
    const projects = await projectRepository.find({
      where: { academicYear: year, status: ProjectStatus.APPROVED },
      relations: { team: true },
    });

    const teamRepository = AppDataSource.getRepository(Team);
    const teams = await teamRepository.find({
      where: { teamLeader: { academicYear: year } },
      relations: { members: true },
    });

    for (const team of teams) {
      if (
        team.members.length === 0 &&
        parameter.maxTeamSize != team.members.length
      ) {
        return res
          .status(400)
          .send({ message: 'Team has no members / not max length' });
      }
    }

    for (const team of teams) {
      if (team.wishList.entries.length == 0) {
        return res
          .status(400)
          .send({ message: 'Team has no wish list entries' });
      }
    }
    // Check if there are any approved projects for the specified year

    if (!projects || projects.length === 0) {
      return res
        .status(404)
        .send({ message: 'No approved projects found for this year' });
    }

    if (projects.length * parameter.maxTeams < teams.length) {
      return res.status(400).send({
        message: 'Not enough approved projects for the number of teams',
      });
    }

    // Logic to distribute projects to teams
    // This is a placeholder; actual distribution logic will depend on your requirements
    const assignmentLogs: any[] = [];

    for (const project of projects) {
      const availableTeams = teams.filter(team => !team.project);
      if (availableTeams.length === 0) break;
      const randomIndex = Math.floor(Math.random() * availableTeams.length);
      const team = availableTeams[randomIndex];

      let assigned = false;
      for (const wishProjectId of team.wishList.entries) {
        if (wishProjectId.id === project.id) {
          team.project = project;
          project.team.push(team);
          assigned = true;
          assignmentLogs.push({
            projectId: project.id,
            teamId: team.id,
            match: true,
            message: `Assigned project ${project.title} to team ${team.id} (priority match)`,
          });
          break;
        }
      }
      if (!assigned) {
        team.project = project;
        project.team.push(team);
        assignmentLogs.push({
          projectId: project.id,
          teamId: team.id,
          match: false,
          message: `Assigned project ${project.title} to team ${team.id} (no wish match)`,
        });
      }
      await projectRepository.save(project);
      await teamRepository.save(team);
    }

    res.status(200).send({ data: assignmentLogs });
  } catch (e) {}
};

export const deleteProject = async (
  req: JwtRequest<{ projectId: string }>,
  res: Response<ResponseDTO<string>>,
) => {
  const projectRepository = AppDataSource.getRepository(Project);
  try {
    const project = await projectRepository.findOneOrFail({
      where: { id: parseInt(req.params.projectId) },
    });
    await projectRepository.remove(project);
    res.status(200).send({ data: 'Project deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).send({ data: 'Failed to delete project' });
  }
};

export {
  assignProjectToTeam,
  getProjectOverview,
  getApprovedProjects,
  createProject,
  distributeProject,
};
