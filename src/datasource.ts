import { DataSource, DataSourceOptions } from 'typeorm';
import { User } from './entities/User';
import mysql2 from 'mysql2';
import { Student } from './entities/Student';
import { Teacher } from './entities/Teacher';
import { Admin } from './entities/Admin';
import { SeederOptions } from 'typeorm-extension';
import { UserSeeder } from './dataloader/seeders';
import { adminFactory, studentFactory, teacherFactory, userFactory } from './dataloader/factories';
const options: DataSourceOptions & SeederOptions = {
  type: 'mysql',
  driver: mysql2,
  host: 'localhost',
  port: 3306,
  username: process.env['DB_USER'],
  password: process.env['DB_PASS'],
  database: process.env['DB_NAME'],
  synchronize: true,
  logging: true,
  entities: [User, Student, Teacher, Admin],
  subscribers: [],
  migrations: [],
  dropSchema: true,
  seeds: [UserSeeder],
  factories: [userFactory,studentFactory,teacherFactory,adminFactory],
};

export const AppDataSource = new DataSource(options);