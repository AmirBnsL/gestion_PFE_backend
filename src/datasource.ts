import { DataSource, DataSourceOptions } from 'typeorm';
import { User } from './entities/User';
import mysql2 from 'mysql2';
import { Student } from './entities/Student';
import { Teacher } from './entities/Teacher';
import { Admin } from './entities/Admin';
import { SeederOptions } from 'typeorm-extension';
import { UserSeeder } from './dataloader/seeders';
import { userFactory } from './dataloader/factories';
const options: DataSourceOptions & SeederOptions = {
  type: 'mysql',
  driver: mysql2,
  host: 'localhost',
  port: 3306,
  username: 'amirbnsl',
  password: 'amir',
  database: 'gestion_pfe',
  synchronize: true,
  logging: false,
  entities: [User, Student, Teacher, Admin],
  subscribers: [],
  migrations: [],
  dropSchema: true,
  seeds: [UserSeeder],
  factories: [userFactory],
};

export const AppDataSource = new DataSource(options);