export interface ChatItem {
  id: string;
  name: string;
  lastMessage: string;
  time: string;
  unreadCount?: number;
  isOnline?: boolean;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName?: string;
  content: string;
  timestamp: Date;
  isRead: boolean;
  attachments?: Array<{
    url: string;
    fileName: string;
    fileSize: number;
    mimeType: string;
  }>;
}

// Topic category for scoped chat threads
export type TopicCategory = 'quality' | 'schedule' | 'drawing' | 'others';

export const TOPIC_CATEGORY_KEYS: TopicCategory[] = ['quality', 'schedule', 'drawing', 'others'];

export interface ChatRoom {
  id: string;
  name: string;
  participants: string[];
  lastMessage?: ChatMessage;
  unreadCount: number;
}
