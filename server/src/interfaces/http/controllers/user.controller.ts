import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import UserModel from '../../../infrastructure/models/UserModel';
import { UserRole } from '../../../domain/user';
import Joi from 'joi';

export async function listUsers(_req: Request, res: Response) {
  const users = await UserModel.find().select('-passwordHash');
  res.json({ users });
}

export async function getUser(req: Request, res: Response) {
  const user = await UserModel.findById(req.params.id).select('-passwordHash');
  if (!user) return res.status(StatusCodes.NOT_FOUND).json({ error: { message: 'User not found' } });
  res.json({ user });
}

const updateSchema = Joi.object({
  fullName: Joi.string().min(2),
  role: Joi.string().valid(...Object.values(UserRole)),
  isActive: Joi.boolean()
});

export async function updateUser(req: Request, res: Response) {
  const { value, error } = updateSchema.validate(req.body);
  if (error) return res.status(StatusCodes.BAD_REQUEST).json({ error: { message: error.message } });
  const user = await UserModel.findByIdAndUpdate(req.params.id, value, { new: true }).select('-passwordHash');
  if (!user) return res.status(StatusCodes.NOT_FOUND).json({ error: { message: 'User not found' } });
  res.json({ user });
}

export async function deleteUser(req: Request, res: Response) {
  const user = await UserModel.findByIdAndDelete(req.params.id);
  if (!user) return res.status(StatusCodes.NOT_FOUND).json({ error: { message: 'User not found' } });
  res.status(StatusCodes.NO_CONTENT).send();
}


