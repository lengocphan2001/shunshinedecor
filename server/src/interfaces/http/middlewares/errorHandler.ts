import { NextFunction, Request, Response } from 'express';
import { StatusCodes, getReasonPhrase } from 'http-status-codes';

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  const defaultStatus = StatusCodes.INTERNAL_SERVER_ERROR;
  const message = err instanceof Error ? err.message : 'Unexpected error';
  const status = (err as any)?.status || defaultStatus;
  res.status(status).json({
    error: {
      message,
      status,
      reason: getReasonPhrase(status)
    }
  });
}


