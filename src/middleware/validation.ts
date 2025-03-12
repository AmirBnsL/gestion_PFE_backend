import { NextFunction } from 'express';
import { Request, Response } from 'express';
import { z, ZodError } from 'zod';
import {StatusCodes} from 'http-status-codes';

/**
 * Here we put all the validation schemas
 */

const passwordSchema = z.string()
  .min(8, { message: "Password must be at least 8 characters long" })
  .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
  .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
  .regex(/\d/, { message: "Password must contain at least one digit" })
  .regex(/[@$!%*?&]/, { message: "Password must contain at least one special character" });

export const userRegistrationSchema = z.object({
    email: z.string().email(),
    firstname: z.string(),
    lastname:z.string(),
    password: passwordSchema,
});


export const paginationSchema =
    z.object({
        page: z.coerce.number().int().positive(),
        limit:z.coerce.number().int().positive()
    });


export const userLoginSchema = z.object({
    email: z.string().email(),
    password:z.string(),
})

/**
 * Validate the data against the schema and return an error if the data is invalid
 *
 * @param schema
 */


export function validateBody(schema: z.ZodObject<any, any>) {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            schema.parse(req.body);
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                handleValidationError(error,res)
            } else {
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' });
            }
        }
    };
}

export function validateQuery(schema:z.ZodObject<any, any>) {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            schema.parse(req.query);
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                handleValidationError(error,res)
            } else {
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' });
            }
        }
    };
}

export function validateParams(schema:z.ZodObject<any, any>) {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            schema.parse(req.params);
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                handleValidationError(error,res)
            } else {
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' });
            }
        }
    };
}

function handleValidationError(error: ZodError, res: Response) {
    const errorMessages = error.errors.map((issue: any) => ({
        message: `${issue.path.join('.')} is ${issue.message}`,
    }));
    res.status(StatusCodes.BAD_REQUEST).json({ error: 'Invalid data', details: errorMessages });
}