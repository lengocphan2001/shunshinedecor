import jwt, { Secret, SignOptions } from 'jsonwebtoken';

export interface JwtUserPayload {
  sub: string;
  email: string;
  role: string;
}

export function signAccessToken(payload: JwtUserPayload): string {
  const secret = process.env.JWT_ACCESS_SECRET as Secret | undefined;
  const ttl = (process.env.ACCESS_TOKEN_TTL as SignOptions['expiresIn']) || '15m';
  if (!secret) throw new Error('JWT_ACCESS_SECRET not set');
  return jwt.sign(payload, secret, { expiresIn: ttl });
}

export function signRefreshToken(payload: JwtUserPayload): string {
  const secret = process.env.JWT_REFRESH_SECRET as Secret | undefined;
  const ttl = (process.env.REFRESH_TOKEN_TTL as SignOptions['expiresIn']) || '7d';
  if (!secret) throw new Error('JWT_REFRESH_SECRET not set');
  return jwt.sign(payload, secret, { expiresIn: ttl });
}

export function verifyAccessToken(token: string): JwtUserPayload {
  const secret = process.env.JWT_ACCESS_SECRET as Secret | undefined;
  if (!secret) throw new Error('JWT_ACCESS_SECRET not set');
  return jwt.verify(token, secret) as JwtUserPayload;
}

export function verifyRefreshToken(token: string): JwtUserPayload {
  const secret = process.env.JWT_REFRESH_SECRET as Secret | undefined;
  if (!secret) throw new Error('JWT_REFRESH_SECRET not set');
  return jwt.verify(token, secret) as JwtUserPayload;
}


