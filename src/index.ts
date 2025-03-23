import express, { Express, Request, Response } from 'express';
import 'reflect-metadata';
import swagger from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import morgan from 'morgan';
import cors from 'cors';
import { AppDataSource } from './configs/datasource';
import userRoutes from './routes/userRoutes';
import { User, UserRole } from './entities/User';
import { Admin } from './entities/Admin';
import { runSeeders } from 'typeorm-extension';
import bcrypt from 'bcryptjs';
import adminRoutes from './routes/adminRoutes';
import projectRoutes from './routes/projectRoutes';
import { createServer } from 'http';
import { Server } from 'socket.io';
import announcementsRoutes from './routes/announcementsRoutes';
import { options } from './configs/swaggerConfig';

AppDataSource.initialize()
  .then(async () => {
    // here you can start to work with your database
    console.log('Database is connected');

    await runSeeders(AppDataSource);
    const userRepository = AppDataSource.getRepository(User);
    const adminRepository = AppDataSource.getRepository(Admin);

    const admin = new Admin();
    admin.id = 1;
    admin.firstname = 'Admin';
    admin.lastname = 'Admin';

    const user = new User();
    user.id = 1;
    user.email = 'admin@gmail.com';
    user.role = UserRole.ADMIN;
    user.passwordHash = await bcrypt.hash('admin', 8);
    user.admin = admin;

    await adminRepository.save(admin);
    await userRepository.save(user);
  })
  .catch(error => console.log(error));

// Swagger options for API documentation

const swaggerSpec = swaggerJsdoc(options);

const app: Express = express();

const server = createServer(app);

export const io = new Server(server);

app.use(express.json());
app.use(morgan('dev'));
app.use(cors());

const port = process.env.PORT || 8080;
app.use('/api-docs', swagger.serve, swagger.setup(swaggerSpec));
app.use('/api/', [userRoutes, adminRoutes, projectRoutes, announcementsRoutes]);
app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server');
});

server.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});

//TODO : Authorization, Authentication ,CRUD of users,One to one relation ship with users
