import { DataSource, DataSourceOptions } from 'typeorm';
import { User } from '../entities/User';
import mysql2 from 'mysql2';
import { Student } from '../entities/Student';
import { Teacher } from '../entities/Teacher';
import { Admin } from '../entities/Admin';
import { SeederOptions } from 'typeorm-extension';
import {
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
  entities: [User, Student, Teacher, Admin, Announcement, Project, Team, Task],
  subscribers: [],
  migrations: [],
  dropSchema: true,
  seeds: [UserSeeder, ProjectSeeder, TeamSeeder, TaskSeeder],
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
