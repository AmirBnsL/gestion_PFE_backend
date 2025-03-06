"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
var typeorm_1 = require("typeorm");
var User_1 = require("./entities/User");
var mysql2_1 = __importDefault(require("mysql2"));
var dotenv_1 = __importDefault(require("dotenv"));
var Student_1 = require("./entities/Student");
dotenv_1.default.config();
console.log(process.env['DB_USER']);
console.log(process.env['DB_PASSWORD']);
exports.AppDataSource = new typeorm_1.DataSource({
    type: "mysql",
    driver: mysql2_1.default,
    host: "localhost",
    port: 3306,
    username: "amirbnsl",
    password: "amir",
    database: "gestion_pfe",
    synchronize: true,
    logging: true,
    entities: [User_1.User, Student_1.Student],
    subscribers: [],
    migrations: [],
});
