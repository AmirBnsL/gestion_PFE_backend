import { AppError } from '../errors/AppError';
import { Request, Response, NextFunction } from 'express';

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      message: err.message,
    });
  } else {
    console.error(err); // Log the error for debugging
    res.status(500).json({
      status: 'error',
      message: 'Internal Server Error',
    });
  }
  // Handle other unexpected errors
}
