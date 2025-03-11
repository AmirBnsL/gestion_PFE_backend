import express, { Express, Request, Response } from 'express';
import 'reflect-metadata';
import swagger from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import morgan from 'morgan';

import { AppDataSource } from './datasource';
import userRoutes from './routes/userRoutes';
import { User, UserRole } from './entities/User';
import { Admin } from './entities/Admin';
import { runSeeders } from 'typeorm-extension';

AppDataSource.initialize()
  .then(async () => {
      // here you can start to work with your database
      console.log("Database is connected")

    await runSeeders(AppDataSource);
    const userRepository = AppDataSource.getRepository(User);
    const adminRepository = AppDataSource.getRepository(Admin);

    const admin = new Admin();
    admin.id = 1;

    const user = new User();
    user.id = 1;
    user.email = 'amirAdmin@gmail.com';
    user.firstname = 'amir';
    user.lastname = 'benslaimi';
    user.role = UserRole.ADMIN;
    user.passwordHash = 'Chikouri2**5';
    user.admin = admin;

    await adminRepository.save(admin);
    await userRepository.save(user);
  })
  .catch((error) => console.log(error))

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'My API',
      version: '1.0.0',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/routes/*.ts'],
};
const swaggerSpec = swaggerJsdoc(options);




const app: Express = express();

app.use(express.json());
app.use(morgan("dev"));
const port = process.env.PORT || 3000;
app.use("/api-docs", swagger.serve, swagger.setup(swaggerSpec));
app.use("/api/", userRoutes);
app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);

});

//TODO : Authorization, Authentication ,CRUD of users,One to one relation ship with users
