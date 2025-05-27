import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { User, UserRole } from '../entities/User';
import { Admin } from '../entities/Admin';
import { Student } from '../entities/Student';
import { Teacher } from '../entities/Teacher';
import { Project } from '../entities/Project';
import { Team } from '../entities/Team';
import { Task } from '../entities/Task';
import { Parameter } from '../entities/Parameter';
import { AcademicYear } from '../enums/AcademicYear';
export class UserSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    const userFactory = factoryManager.get(User);
    const adminFactory = factoryManager.get(Admin);
    const studentFactory = factoryManager.get(Student);
    const teacherFactory = factoryManager.get(Teacher);

    // Create users with different roles
    const users = await userFactory.saveMany(20);

    for (const user of users) {
      if (user.id !== 1) {
        if (user.role === UserRole.ADMIN) {
          user.admin = await adminFactory.save();
          await dataSource.getRepository(User).save(user);
        } else if (user.role === UserRole.STUDENT) {
          user.student = await studentFactory.save();
          await dataSource.getRepository(User).save(user);
        } else if (user.role === UserRole.TEACHER) {
          user.teacher = await teacherFactory.save();
          await dataSource.getRepository(User).save(user);
        }
      }
    }
  }
}

export class ProjectSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    const teacherRepository = dataSource.getRepository(Teacher);
    const projectRepository = dataSource.getRepository(Project);
    const projectFactory = factoryManager.get(Project);

    const teachers = await teacherRepository.find();
    for (const teacher of teachers) {
      const projects = await projectFactory.saveMany(3);
      for (const project of projects) {
        project.proposedBy = teacher;
      }
      await projectRepository.save(projects);
    }
  }
}

export class TeamSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    const teamFactory = factoryManager.get(Team);
    const projectRepository = dataSource.getRepository(Project);
    const studentRepository = dataSource.getRepository(Student);

    const projects = await projectRepository.find();
    const students = await studentRepository.find();

    for (const project of projects) {
      const team = await teamFactory.save();
      team.project = project;
      team.members = [];

      const numberOfStudents = Math.floor(Math.random() * 5) + 1;
      const assignedStudentIds = new Set<number>();
      for (let i = 0; i < numberOfStudents; i++) {
        const randomStudent =
          students[Math.floor(Math.random() * students.length)];
        if (!assignedStudentIds.has(randomStudent.id)) {
          assignedStudentIds.add(randomStudent.id);
          //TODO: fix this
        }
      }

      await dataSource.getRepository(Team).save(team);
    }
  }
}

export class TaskSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    const taskFactory = factoryManager.get(Task);
    const projectRepository = dataSource.getRepository(Project);

    const projects = await projectRepository.find({
      relations: ['team', 'team.students'],
    });

    for (const project of projects) {
      for (const team of project.team) {
        for (let i = 0; i < 5; i++) {
          const task = await taskFactory.save();

          //TODO: fix this
          await dataSource.getRepository(Task).save(task);
        }
      }
    }
  }
}

export class ParameterSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    const parameterRepository = dataSource.getRepository(Parameter);
    const parameters: Parameter[] = [
      {
        id: 1,
        maxTeamSize: 5,
        allowTeamCreation: true,
        year: AcademicYear.FIRST,
        allowTeamJoining: true,
        allowWishListCreation: true,
        distributionMode: 'manual',
        maxTeams: 5,
      },
      {
        id: 2,
        maxTeamSize: 5,
        allowTeamCreation: true,
        year: AcademicYear.SECOND,
        allowTeamJoining: true,
        allowWishListCreation: true,
        distributionMode: 'manual',
        maxTeams: 5,
      },
      {
        id: 3,
        maxTeamSize: 5,
        allowTeamCreation: true,
        year: AcademicYear.THIRD,
        allowTeamJoining: true,
        allowWishListCreation: true,
        distributionMode: 'manual',
        maxTeams: 5,
      },
      {
        id: 4,
        maxTeamSize: 5,
        allowTeamCreation: true,
        year: AcademicYear.FOURTH,
        allowTeamJoining: true,
        allowWishListCreation: true,
        distributionMode: 'manual',
        maxTeams: 5,
      },
      {
        id: 5,
        maxTeamSize: 5,
        allowTeamCreation: true,
        year: AcademicYear.FIFTH,
        allowTeamJoining: true,
        allowWishListCreation: true,
        distributionMode: 'manual',
        maxTeams: 5,
      },
    ];
    for (const parameter of parameters) {
      await parameterRepository.save(parameter);
    }
  }
}
