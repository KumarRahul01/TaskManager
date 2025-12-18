import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

export const errorHandler = async (
  error: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Zod validation errror handling
  if (error instanceof ZodError) {
    return res.status(400).json({
      message: 'Validation failed',
      errors: error.issues.map((err) => ({
        field: err.path.join('.'),
        message: err.message,
      })),
    });
  }

  // Application errors
  if (error instanceof Error) {
    return res.status(400).json({
      message: error.message,
    });
  }

  // Unknown errors
  return res.status(500).json({
    message: 'Internal server error',
  });
};
