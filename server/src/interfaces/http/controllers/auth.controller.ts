import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import UserModel from '../../../infrastructure/models/UserModel';
import { hashPassword, comparePassword } from '../../../application/auth/password';
import { signAccessToken, signRefreshToken } from '../../../application/auth/jwt';
import { UserRole } from '../../../domain/user';
import Joi from 'joi';

const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  fullName: Joi.string().min(2).required(),
  role: Joi.string().valid(...Object.values(UserRole)).default(UserRole.STAFF)
});

export async function register(req: Request, res: Response) {
  const { value, error } = registerSchema.validate(req.body);
  if (error) return res.status(StatusCodes.BAD_REQUEST).json({ error: { message: error.message } });

  const existing = await UserModel.findOne({ email: value.email });
  if (existing) return res.status(StatusCodes.CONFLICT).json({ error: { message: 'Email already in use' } });

  const passwordHash = await hashPassword(value.password);
  const user = await UserModel.create({
    email: value.email,
    passwordHash,
    fullName: value.fullName,
    role: value.role,
    isActive: true
  });

  const payload = { sub: String(user._id), email: user.email, role: user.role };
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);
  return res.status(StatusCodes.CREATED).json({ user: { id: user._id, email: user.email, fullName: user.fullName, role: user.role }, tokens: { accessToken, refreshToken } });
}

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

export async function login(req: Request, res: Response) {
  const { value, error } = loginSchema.validate(req.body);
  if (error) return res.status(StatusCodes.BAD_REQUEST).json({ error: { message: error.message } });

  const user = await UserModel.findOne({ email: value.email });
  if (!user || !user.isActive) return res.status(StatusCodes.UNAUTHORIZED).json({ error: { message: 'Invalid credentials' } });

  const ok = await comparePassword(value.password, user.passwordHash);
  if (!ok) return res.status(StatusCodes.UNAUTHORIZED).json({ error: { message: 'Invalid credentials' } });

  const payload = { sub: String(user._id), email: user.email, role: user.role };
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);
  return res.status(StatusCodes.OK).json({ user: { id: user._id, email: user.email, fullName: user.fullName, role: user.role }, tokens: { accessToken, refreshToken } });
}

export async function me(_req: Request, res: Response) {
  const authUser = (res.req as any).user as { sub: string };
  const user = await UserModel.findById(authUser.sub).select('-passwordHash');
  if (!user) return res.status(StatusCodes.NOT_FOUND).json({ error: { message: 'User not found' } });
  return res.json({ user });
}


