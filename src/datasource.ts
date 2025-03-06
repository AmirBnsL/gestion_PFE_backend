import { DataSource } from 'typeorm';
import { User } from './entities/User';
import mysql2 from 'mysql2';
import dotenv from 'dotenv';
import { Student } from './entities/Student';
dotenv.config()
console.log(process.env['DB_USER'])
console.log(process.env['DB_PASSWORD'])

export const AppDataSource = new DataSource({
  type: "mysql",
  driver: mysql2,
  host: "localhost",
  port: 3306,
  username: "amirbnsl",
  password: "amir",
  database: "gestion_pfe",
  synchronize: true,
  logging: true,
  entities: [User,Student],
  subscribers: [],
  migrations: [],
})

