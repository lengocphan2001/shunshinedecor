import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import Joi from 'joi';
import ProjectModel from '../../../infrastructure/models/ProjectModel';
import ChatRoomModel from '../../../infrastructure/models/ChatRoomModel';
import { ProjectStatus } from '../../../domain/project';

const createSchema = Joi.object({
  name: Joi.string().min(2).required(),
  startDate: Joi.date().required(),
  endDate: Joi.date().required(),
});

export async function listProjects(_req: Request, res: Response) {
  const projects = await ProjectModel.find().sort({ createdAt: -1 });
  res.json({ projects });
}

export async function createProject(req: Request, res: Response) {
  const { value, error } = createSchema.validate(req.body);
  if (error) return res.status(StatusCodes.BAD_REQUEST).json({ error: { message: error.message } });
  const user = (req as any).user as { sub: string };
  
  // Create project
  const project = await ProjectModel.create({
    ...value,
    description: '',
    status: ProjectStatus.IN_PROGRESS,
    progress: 0,
    teamMembers: [],
    tasks: [],
    createdBy: user.sub,
  });

  // Automatically create a chat room for the project
  const chatRoom = await ChatRoomModel.create({
    name: project.name,
    projectId: project._id,
    participants: [user.sub], // Add creator as participant
    lastMessage: null,
    unreadCountMap: new Map(),
  });

  res.status(StatusCodes.CREATED).json({ 
    project,
    chatRoom: {
      id: chatRoom._id,
      name: chatRoom.name,
      projectId: chatRoom.projectId,
      participants: chatRoom.participants,
      lastMessage: chatRoom.lastMessage,
      unreadCount: 0,
    }
  });
}

export async function listProjectContacts(req: Request, res: Response) {
  const { id } = req.params as { id: string };
  const project = await ProjectModel.findById(id).select('contacts name');
  if (!project) return res.status(StatusCodes.NOT_FOUND).json({ error: { message: 'Project not found' } });
  res.json({ projectId: id, name: project.name, contacts: (project as any).contacts ?? [] });
}

export async function addProjectContact(req: Request, res: Response) {
  const { id } = req.params as { id: string };
  const { name, displayName, phone, email } = req.body || {};
  if (!name || !displayName) return res.status(StatusCodes.BAD_REQUEST).json({ error: { message: 'name and displayName are required' } });
  const project = await ProjectModel.findById(id);
  if (!project) return res.status(StatusCodes.NOT_FOUND).json({ error: { message: 'Project not found' } });
  (project as any).contacts.push({ name, displayName, phone: phone || '', email: email || '' });
  await project.save();
  res.json({ contacts: (project as any).contacts });
}


