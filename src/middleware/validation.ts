import { NextFunction } from 'express';
import { Request, Response } from 'express';
import { z, ZodError } from 'zod';
import { StatusCodes } from 'http-status-codes';
import specialty from '../enums/specialty';
import { TaskStatus } from '../entities/Task';
import { Audience, Priority } from '../entities/Announcement';

/**
 * Here we put all the validation schemas
 */

export const projectCreationSchema = z.object({
  title: z.string().min(3, { message: 'Title must be at least 3 characters' }),
  description: z
    .string()
    .min(10, { message: 'Description must be at least 10 characters' }),
  specialty: z.enum([specialty.ISI, specialty.SIW, specialty.AIDS]),
});

export const taskCreationSchema = z.object({
  status: z.enum([TaskStatus.DONE, TaskStatus.IN_PROGRESS, TaskStatus.TODO]),
  title: z.string().min(3, { message: 'Title must be at least 3 characters' }),
  description: z
    .string()
    .min(10, { message: 'Description must be at least 10 characters' }),
  dueDate: z.date(),
  priority: z.enum([Priority.LOW, Priority.MEDIUM, Priority.HIGH]),
  projectId: z.coerce.number().int().positive(),
  teamId: z.coerce.number().int().positive(),
});

export const announcementCreationSchema = z.object({
  title: z.string().min(3, { message: 'Title must be at least 3 characters' }),
  body: z.string().min(10, { message: 'Body must be at least 10 characters' }),
  audience: z.enum([Audience.ALL, Audience.STUDENTS, Audience.TEACHERS]),
  priority: z.enum([Priority.LOW, Priority.MEDIUM, Priority.HIGH]),
});

const passwordSchema = z
  .string()
  .min(8, { message: 'Password must be at least 8 characters long' })
  .regex(/[a-z]/, {
    message: 'Password must contain at least one lowercase letter',
  })
  .regex(/[A-Z]/, {
    message: 'Password must contain at least one uppercase letter',
  })
  .regex(/\d/, { message: 'Password must contain at least one digit' })
  .regex(/[@$!%*?&]/, {
    message: 'Password must contain at least one special character',
  });

export const userRegistrationSchema = z.object({
  email: z.string().email(),
  firstname: z.string(),
  lastname: z.string(),
  password: passwordSchema,
});

export const paginationSchema = z.object({
  page: z.coerce.number().int().positive(),
  size: z.coerce.number().int().positive(),
});

export const userLoginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

/**
 * Validate the data against the schema and return an error if the data is invalid
 *
 * @param schema
 */

export function validateBody(schema: z.ZodObject<any, any>) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      debugger;
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        handleValidationError(error, res);
      } else {
        res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ error: 'Internal Server Error' });
      }
    }
  };
}

export function validateQuery(schema: z.ZodObject<any, any>) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.query);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        handleValidationError(error, res);
      } else {
        res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ error: 'Internal Server Error' });
      }
    }
  };
}

export function validateParams(schema: z.ZodObject<any, any>) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.params);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        handleValidationError(error, res);
      } else {
        res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ error: 'Internal Server Error' });
      }
    }
  };
}

function handleValidationError(error: ZodError, res: Response) {
  const errorMessages = error.errors.map((issue: any) => ({
    message: `${issue.path.join('.')} is ${issue.message}`,
  }));
  res
    .status(StatusCodes.BAD_REQUEST)
    .json({ error: 'Invalid data', details: errorMessages });
}
