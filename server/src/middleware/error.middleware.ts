import { Request, Response, NextFunction } from 'express';
import { config } from '../config/index.js';

export interface AppError extends Error {
  statusCode?: number;
  details?: any;
}

export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  console.error(`[Error] ${req.method} ${req.originalUrl}:`, {
    message,
    statusCode,
    details: err.details,
    stack: config.nodeEnv === 'development' ? err.stack : undefined,
  });

  res.status(statusCode).json({
    success: false,
    error: message,
    ...(err.details ? { details: err.details } : {}),
    ...(config.nodeEnv === 'development' ? { stack: err.stack } : {}),
  });
};

export const notFoundHandler = (req: Request, res: Response): void => {
  res.status(404).json({
    success: false,
    error: `Endpoint ${req.method} ${req.originalUrl} not found`,
  });
};
