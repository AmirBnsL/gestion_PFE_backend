// Student schema
const StudentSchema = {
  type: 'object',
  properties: {
    id: { type: 'number' },
    firstname: { type: 'string' },
    lastname: { type: 'string' },
    birthdate: { type: 'string', format: 'date' },
    promotionalYear: { type: 'number' },
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
    group: { type: 'number' },
    specialty: {
      type: 'string',
      enum: [
        'Informations Systems and Internet',
        'Information Systems and Web',
        'Artificial intelligence and Data Sciences',
      ],
    },
    user: { $ref: '#/components/schemas/User' },
  },
};

//User schema
const UserSchema = {
  type: 'object',
  properties: {
    id: { type: 'number' },
    email: { type: 'string', format: 'email' },
    role: {
      type: 'string',
      enum: ['admin', 'teacher', 'student'],
    },
    passwordHash: { type: 'string' },
    student: { $ref: '#/components/schemas/Student' },
    teacher: { $ref: '#/components/schemas/Teacher' },
    admin: { $ref: '#/components/schemas/Admin' },
  },
};

//Admin schema
const AdminSchema = {
  type: 'object',
  properties: {
    id: { type: 'number' },
    firstname: { type: 'string' },
    lastname: { type: 'string' },
    user: { $ref: '#/components/schemas/User' },
  },
};

// Teacher schema
const TeacherSchema = {
  type: 'object',
  properties: {
    id: { type: 'number' },
    subject: { type: 'string' },
    firstname: { type: 'string' },
    lastname: { type: 'string' },
    birthdate: { type: 'string', format: 'date' },
    rank: {
      type: 'string',
      enum: ['Professor', 'Associate', 'Assistant'],
    },
    role: {
      type: 'string',
      enum: ['LECTURER', 'INSTRUCTOR'],
    },
    user: { $ref: '#/components/schemas/User' },
  },
};

// Project schema
const ProjectSchema = {
  type: 'object',
  properties: {
    id: { type: 'number' },
    title: { type: 'string' },
    description: { type: 'string' },
    status: {
      type: 'string',
      enum: [
        'CANCELLED',
        'IN_PROGRESS',
        'PROPOSED',
        'APPROVED',
        'COMPLETED',
        'REJECTED',
      ],
    },
    startDate: { type: 'string', format: 'date' },
    endDate: { type: 'string', format: 'date' },
    students: {
      type: 'array',
      items: { $ref: '#/components/schemas/Student' },
    },
    supervisor: { $ref: '#/components/schemas/Teacher' },
  },
};

// TeamJoinRequest schema
const TeamJoinRequestSchema = {
  type: 'object',
  properties: {
    id: { type: 'number' },
    team: { $ref: '#/components/schemas/Team' },
    fromUser: { $ref: '#/components/schemas/Student' },
    status: {
      type: 'string',
      enum: ['pending', 'accepted', 'declined'],
    },
    createdAt: { type: 'string', format: 'date-time' },
  },
};

// TeamInvite schema
const TeamInviteSchema = {
  type: 'object',
  properties: {
    id: { type: 'number' },
    team: { $ref: '#/components/schemas/Team' },
    toUser: { $ref: '#/components/schemas/Student' },
    status: {
      type: 'string',
      enum: ['pending', 'accepted', 'declined'],
    },
    initiator: {
      type: 'string',
      enum: ['student', 'teamLeader'],
    },
    createdAt: { type: 'string', format: 'date-time' },
  },
};

// SupervisorInvite schema
const SupervisorInviteSchema = {
  type: 'object',
  properties: {
    id: { type: 'number' },
    supervisor: { $ref: '#/components/schemas/Teacher' },
    project: { $ref: '#/components/schemas/Project' },
    initiator: {
      type: 'string',
      enum: ['teacher', 'proposer'],
    },
    createdAt: { type: 'string', format: 'date-time' },
    status: {
      type: 'string',
      enum: ['pending', 'accepted', 'declined'],
    },
  },
};

const TeamSchema = {
  type: 'object',
  properties: {
    id: { type: 'number' },
    name: { type: 'string' },
    teamLeader: { $ref: '#/components/schemas/Student' },
    members: {
      type: 'array',
      items: { $ref: '#/components/schemas/Student' },
    },
    project: { $ref: '#/components/schemas/Project' },
  },
};

// Main Swagger configuration
export const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Gestion PFE API',
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
      schemas: {
        User: UserSchema,
        Admin: AdminSchema,
        Student: StudentSchema,
        Teacher: TeacherSchema,
        Project: ProjectSchema,
        TeamJoinRequest: TeamJoinRequestSchema,
        TeamInvite: TeamInviteSchema,
        SupervisorInvite: SupervisorInviteSchema,
        Team: TeamSchema,
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
