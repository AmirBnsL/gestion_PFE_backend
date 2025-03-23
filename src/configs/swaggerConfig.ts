import { Rank, TeacherRole } from '../entities/Teacher';
import { Audience, Priority } from '../entities/Announcement';
import { ProjectStatus } from '../entities/Project';
import { UserRole } from '../entities/User';


export const options = {
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