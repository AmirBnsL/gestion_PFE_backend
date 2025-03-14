import { DataSource, DataSourceOptions } from 'typeorm';
import { User } from './entities/User';
import mysql2 from 'mysql2';
import { Student } from './entities/Student';
import { Teacher } from './entities/Teacher';
import { Admin } from './entities/Admin';
import { SeederOptions } from 'typeorm-extension';
import { ProjectSeeder, UserSeeder } from './dataloader/seeders';
import { adminFactory, projectFactory, studentFactory, teacherFactory, userFactory } from './dataloader/factories';
import { Announcements } from './entities/Announcements';
import { Project } from './entities/Project';
const options: DataSourceOptions & SeederOptions = {
  type: 'mysql',
  driver: mysql2,
  host: 'localhost',
  port:3306,
  username: process.env['DB_USER'],
  password: process.env['DB_PASS'],
  database: process.env['DB_NAME'],
  synchronize: true,
  logging: false,
  entities: [User, Student, Teacher, Admin,Announcements,Project],
  subscribers: [],
  migrations: [],
  dropSchema: true,
  seeds: [UserSeeder,ProjectSeeder],
  factories: [userFactory,studentFactory,teacherFactory,adminFactory,projectFactory],
};

export const AppDataSource = new DataSource(options);