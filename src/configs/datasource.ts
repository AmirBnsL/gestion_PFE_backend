import { DataSource, DataSourceOptions } from 'typeorm';
import { User } from '../entities/User';
import mysql2 from 'mysql2';
import { Student } from '../entities/Student';
import { Teacher } from '../entities/Teacher';
import { Admin } from '../entities/Admin';
import { SeederOptions } from 'typeorm-extension';
import {
  ParameterSeeder,
  ProjectSeeder,
  TaskSeeder,
  TeamSeeder,
  UserSeeder,
} from '../dataloader/seeders';
import {
  adminFactory,
  projectFactory,
  studentFactory,
  teacherFactory,
  teamFactory,
  userFactory,
} from '../dataloader/factories';
import { Announcement } from '../entities/Announcement';
import { Project } from '../entities/Project';
import { Team } from '../entities/Team';
import { Task } from '../entities/Task';
import { Parameter } from '../entities/Parameter';
import { TeamMembership } from '../entities/TeamMemberships';
import { TeamInvite } from '../entities/TeamInvite';
import { TeamJoinRequest } from '../entities/TeamJoinRequest';
const options: DataSourceOptions & SeederOptions = {
  type: 'mysql',
  driver: mysql2,
  host: 'localhost',
  port: 3306,
  username: process.env['DB_USER'],
  password: process.env['DB_PASS'],
  database: process.env['DB_NAME'],
  synchronize: true,
  logging: false,
  entities: [
    User,
    Student,
    Teacher,
    Admin,
    Announcement,
    Project,
    Team,
    Task,
    Parameter,
    TeamMembership,
    TeamInvite,
    TeamJoinRequest,
  ],
  subscribers: [],
  migrations: [],
  dropSchema: false,
  seeds: [UserSeeder, ProjectSeeder, ParameterSeeder],
  factories: [
    userFactory,
    studentFactory,
    teacherFactory,
    adminFactory,
    projectFactory,
    teamFactory,
  ],
};

export const AppDataSource = new DataSource(options);
