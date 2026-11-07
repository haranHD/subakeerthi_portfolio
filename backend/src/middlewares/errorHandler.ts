import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  console.error('API Error:', err);

  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: err.errors.map((e) => ({
        field: e.path.join('.'),
        message: e.message,
      })),
    });
  }

  if (err instanceof Error) {
    return res.status(500).json({
      success: false,
      message: err.message || 'Internal server error',
    });
  }

  return res.status(500).json({
    success: false,
    message: 'An unexpected error occurred',
  });
}
