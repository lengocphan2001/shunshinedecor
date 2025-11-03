import { request } from './client';

export interface ChatRoomDto {
  id: string;
  name: string;
  projectId: string;
  participants: string[];
  lastMessage?: { senderId?: string; content?: string; timestamp?: string } | null;
  unreadCount: number;
}

export async function listChatsApi(): Promise<{ chats: ChatRoomDto[] }> {
  return request('/api/chats');
}


