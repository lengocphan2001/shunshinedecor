import { Request, Response } from 'express';
import ChatRoomModel from '../../../infrastructure/models/ChatRoomModel';
import { UserRole } from '../../../domain/user';

export async function listChats(req: Request, res: Response) {
  const auth = (req as any).user as { sub: string; role: UserRole };
  const isAdmin = auth.role === UserRole.ADMIN;
  const query = isAdmin ? {} : { participants: { $in: [auth.sub] } };
  const chats = await ChatRoomModel.find(query).sort({ updatedAt: -1 });
  const mapped = chats.map((c) => ({
    id: c._id,
    name: c.name,
    projectId: c.projectId,
    participants: c.participants,
    lastMessage: c.lastMessage,
    unreadCount: Number((c as any).unreadCountMap?.get?.(auth.sub) ?? 0),
  }));
  res.json({ chats: mapped });
}


