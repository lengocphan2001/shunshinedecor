import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { verifyAccessToken } from '../../../application/auth/jwt';

export function authenticate(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(StatusCodes.UNAUTHORIZED).json({ error: { message: 'Unauthorized' } });
  }
  const token = authHeader.substring(7);
  try {
    const payload = verifyAccessToken(token);
    (req as any).user = payload;
    next();
  } catch {
    return res.status(StatusCodes.UNAUTHORIZED).json({ error: { message: 'Invalid token' } });
  }
}

export function authorize(roles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user as { role?: string } | undefined;
    if (!user || !user.role || !roles.includes(user.role)) {
      return res.status(StatusCodes.FORBIDDEN).json({ error: { message: 'Forbidden' } });
    }
    next();
  };
}


