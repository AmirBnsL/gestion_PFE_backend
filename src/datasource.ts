import { DataSource } from 'typeorm';
import { User } from './entities/User';
import mysql2 from 'mysql2';

import { Student } from './entities/Student';
import { Teacher } from './entities/Teacher';



export const AppDataSource = new DataSource({
  type: "mysql",
  driver: mysql2,
  host: "localhost",
  port: 3306,
  username: process.env['DB_USER'],
  password: process.env['DB_PASS'],
  database:"gestion_pfe",
  synchronize: true,
  logging: true,
  entities: [User, Student, Teacher],
  subscribers: [],
  migrations: [],
})

