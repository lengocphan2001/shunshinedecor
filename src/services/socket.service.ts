import { io, Socket } from 'socket.io-client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../constants/config';

class SocketService {
  private socket: Socket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private isConnecting = false;

  async connect() {
    if (this.socket?.connected || this.isConnecting) {
      console.log('Socket already connected or connecting');
      return this.socket;
    }

    this.isConnecting = true;

    try {
      // Get auth token
      const token = await AsyncStorage.getItem('accessToken');
      console.log('SocketService.connect - token:', token ? `${token.substring(0, 20)}...` : 'NO TOKEN');
      
      // Create socket connection
      this.socket = io(API_BASE_URL, {
        auth: {
          token: token || undefined,
        },
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        reconnectionAttempts: this.maxReconnectAttempts,
        transports: ['websocket', 'polling'],
      });

      this.setupEventHandlers();
      
      return this.socket;
    } catch (error) {
      console.error('Socket connection error:', error);
      this.isConnecting = false;
      throw error;
    }
  }

  private setupEventHandlers() {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('Socket connected:', this.socket?.id);
      this.reconnectAttempts = 0;
      this.isConnecting = false;
    });

    this.socket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
      this.isConnecting = false;
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      this.reconnectAttempts++;
      this.isConnecting = false;
      
      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        console.error('Max reconnect attempts reached');
      }
    });

    this.socket.on('error', (error) => {
      console.error('Socket error:', error);
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnecting = false;
    }
  }

  // Reconnect with new token (after login)
  async reconnect() {
    console.log('SocketService.reconnect - disconnecting old connection');
    this.disconnect();
    console.log('SocketService.reconnect - connecting with new token');
    await this.connect();
  }

  getSocket(): Socket | null {
    return this.socket;
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }

  // Chat events
  joinChatRoom(chatRoomId: string) {
    console.log('SocketService.joinChatRoom - connected:', this.socket?.connected, 'chatRoomId:', chatRoomId);
    if (this.socket?.connected) {
      this.socket.emit('chat:join', { chatRoomId });
      console.log('Emitted chat:join event');
    } else {
      console.error('Socket not connected, cannot join room');
    }
  }

  sendChatMessage(chatRoomId: string, content: string, attachments?: Array<{
    url: string;
    fileName: string;
    fileSize: number;
    mimeType: string;
  }>) {
    console.log('SocketService.sendChatMessage - connected:', this.socket?.connected, 'chatRoomId:', chatRoomId, 'content:', content, 'attachments:', attachments);
    if (this.socket?.connected) {
      this.socket.emit('chat:message', { 
        chatRoomId, 
        content,
        attachments: attachments || []
      });
      console.log('Emitted chat:message event');
    } else {
      console.error('Socket not connected, cannot send message');
    }
  }

  sendTypingIndicator(chatRoomId: string, isTyping: boolean) {
    if (this.socket?.connected) {
      this.socket.emit('chat:typing', { chatRoomId, isTyping });
    }
  }

  onChatHistory(callback: (data: any) => void) {
    this.socket?.on('chat:history', callback);
  }

  onChatMessage(callback: (data: any) => void) {
    this.socket?.on('chat:message', callback);
  }

  onChatTyping(callback: (data: any) => void) {
    this.socket?.on('chat:typing', callback);
  }

  // Topic events
  joinTopicRoom(chatRoomId: string) {
    console.log('SocketService.joinTopicRoom - connected:', this.socket?.connected, 'chatRoomId:', chatRoomId);
    if (this.socket?.connected) {
      this.socket.emit('topic:join', { chatRoomId });
      console.log('Emitted topic:join event');
    } else {
      console.error('Socket not connected, cannot join topic room');
    }
  }

  createTopicPost(
    chatRoomId: string, 
    category: 'quality' | 'schedule' | 'drawing' | 'others', 
    content: string,
    attachments?: Array<{
      url: string;
      fileName: string;
      fileSize: number;
      mimeType: string;
    }>
  ) {
    console.log('SocketService.createTopicPost - connected:', this.socket?.connected, 'chatRoomId:', chatRoomId, 'category:', category, 'content:', content, 'attachments:', attachments);
    if (this.socket?.connected) {
      this.socket.emit('topic:post', { chatRoomId, category, content, attachments: attachments || [] });
      console.log('Emitted topic:post event');
    } else {
      console.error('Socket not connected, cannot create topic post');
    }
  }

  addTopicComment(postId: string, content: string) {
    if (this.socket?.connected) {
      this.socket.emit('topic:comment', { postId, content });
    }
  }

  approveTopicPost(postId: string, signature?: string) {
    if (this.socket?.connected) {
      this.socket.emit('topic:approve', { postId, signature });
    }
  }

  onTopicHistory(callback: (data: any) => void) {
    this.socket?.on('topic:history', callback);
  }

  onTopicPost(callback: (data: any) => void) {
    this.socket?.on('topic:post', callback);
  }

  onTopicComment(callback: (data: any) => void) {
    this.socket?.on('topic:comment', callback);
  }

  onTopicApprove(callback: (data: any) => void) {
    this.socket?.on('topic:approve', callback);
  }

  // User status events
  onUserOnline(callback: (data: { userId: string }) => void) {
    this.socket?.on('user:online', callback);
  }

  onUserOffline(callback: (data: { userId: string }) => void) {
    this.socket?.on('user:offline', callback);
  }

  // Remove event listeners
  off(event: string, callback?: any) {
    this.socket?.off(event, callback);
  }
}

// Export singleton instance
export default new SocketService();

