import express, { Express, Request, Response } from 'express';
import 'reflect-metadata';
import swagger from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import morgan from 'morgan';
import cors from 'cors'
import { AppDataSource } from './datasource';
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
import { Audience, Priority } from './entities/Announcement';
import { ProjectStatus } from './entities/Project';
import { Rank, TeacherRole } from './entities/Teacher';

AppDataSource.initialize()
  .then(async () => {
      // here you can start to work with your database
      console.log("Database is connected")

    await runSeeders(AppDataSource);
    const userRepository = AppDataSource.getRepository(User);
    const adminRepository = AppDataSource.getRepository(Admin);

    const admin = new Admin();
    admin.id = 1;
    admin.firstname='Amir';
    admin.lastname='Chikouri';


    const user = new User();
    user.id = 1;
    user.email = 'admin@gmail.com';
    user.role = UserRole.ADMIN;
    user.passwordHash = await bcrypt.hash('admin', 8);
    user.admin = admin;

    await adminRepository.save(admin);
    await userRepository.save(user);
  })
  .catch((error) => console.log(error))

// Swagger options for API documentation
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Gestion PFE API',
      version: '1.0.0',
    },
    components: {
      // Security schemes for authentication
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      // Schema definitions for API models
      schemas: {
        Student: {
          type: 'object',
          properties: {
            id: {
              type: 'number',
            },
            firstname: {
              type: 'string',
            },
            lastname: {
              type: 'string',
            },
            birthdate: {
              type: 'string',
              format: 'date',
            },
            promotionalYear: {
              type: 'number',
            },
            academicYear: {
              type: 'string',
              enum: [
                '1st preparatory class',
                '2nd preparatory class',
                '1st superior class',
                '2nd superior class',
                '3rd superior class',
              ],
            },
            group: {
              type: 'number',
            },
            specialty: {
              type: 'string',
              enum: [
                'Informations Systems and Internet',
                'Information Systems and Web',
                'Artificial intelligence and Data Sciences',
              ],
            },
            user: {
              $ref: '#/components/schemas/User',
            },
          },
        },
        Teacher: {
          type: 'object',
          properties: {
            id: {
              type: 'number',
            },
            subject: {
              type: 'string',
            },
            firstname: {
              type: 'string',
            },
            lastname: {
              type: 'string',
            },
            birthdate: {
              type: 'string',
              format: 'date',
            },
            rank: {
              type: 'string',
              enum: [Rank.Professor,Rank.Associate,Rank.Assistant],
            },
            role: {
              type: 'string',
              enum: [TeacherRole.LECTURER,TeacherRole.INSTRUCTOR],
            },
            user: {
              $ref: '#/components/schemas/User',
            },
          },
        },
        Admin: {
          type: 'object',
          properties: {
            id: {
              type: 'number',
            },
            firstname: {
              type: 'string',
            },
            lastname: {
              type: 'string',
            },
          },
        },
        Announcement: {
          type: 'object',
          properties: {
            id: {
              type: 'number',
            },
            title: {
              type: 'string',
            },
            body: {
              type: 'string',
            },
            audience: {
              type: 'string',
              enum: [Audience.ALL,Audience.STUDENTS,Audience.TEACHERS],
            },
            priority: {
              type: 'string',
              enum: [Priority.LOW,Priority.MEDIUM,Priority.HIGH],
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        Project: {
          type: 'object',
          properties: {
            id: {
              type: 'number',
            },
            title: {
              type: 'string',
            },
            description: {
              type: 'string',
            },
            status: {
              type: 'string',
              enum: [ProjectStatus.CANCELLED,ProjectStatus.IN_PROGRESS,ProjectStatus.PROPOSED,ProjectStatus.APPROVED,ProjectStatus.COMPLETED,ProjectStatus.REJECTED],
            },
            startDate: {
              type: 'string',
              format: 'date',
            },
            endDate: {
              type: 'string',
              format: 'date',
            },
            students: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/Student',
              },
            },
            supervisor: {
              $ref: '#/components/schemas/Teacher',
            },
          },
        },
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'number',
            },
            email: {
              type: 'string',
            },
            firstname: {
              type: 'string',
            },
            lastname: {
              type: 'string',
            },
            role: {
              type: 'string',
              enum: [UserRole.STUDENT,UserRole.TEACHER ,UserRole.ADMIN],
            },
          },
        },
      },
    },
    // Global security settings
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  // Paths to the API routes
  apis: ['./src/routes/*.ts'],
};


const swaggerSpec = swaggerJsdoc(options);




const app: Express = express();

const server = createServer(app);


export const io = new Server(server);

app.use(express.json());
app.use(morgan("dev"));
app.use(cors())

const port = process.env.PORT || 8080;
app.use("/api-docs", swagger.serve, swagger.setup(swaggerSpec));
app.use("/api/", [userRoutes,adminRoutes,projectRoutes,announcementsRoutes]);
app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

server.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
})



//TODO : Authorization, Authentication ,CRUD of users,One to one relation ship with users
