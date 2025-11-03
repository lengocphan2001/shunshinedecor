import { Server as HTTPServer } from 'http';
import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { ChatMessageModel, TopicPostModel } from './models/MessageModel';
import ChatRoomModel from './models/ChatRoomModel';

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'your-secret-key-change-in-production';

interface AuthenticatedSocket extends Socket {
  user?: {
    sub: string;
    email: string;
    role?: string;
  };
}

export function setupSocketIO(httpServer: HTTPServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: '*', // Configure this properly in production
      methods: ['GET', 'POST'],
    },
  });

  // Authentication middleware
  io.use((socket: AuthenticatedSocket, next) => {
    const token = socket.handshake.auth.token;
    
    if (!token) {
      // Allow connection without auth for testing
      console.log('Socket connected without auth token - using anonymous user');
      socket.user = {
        sub: 'anonymous',
        email: 'anonymous@test.com',
        role: 'USER',
      };
      return next();
    }

    console.log('Socket received token:', token.substring(0, 20) + '...');

    try {
      const decoded = jwt.verify(token, JWT_ACCESS_SECRET) as { sub: string; email: string; role: string };
      socket.user = decoded;
      console.log(`✅ Socket authenticated successfully for user: ${decoded.email} (${decoded.sub})`);
      next();
    } catch (err) {
      console.error('❌ Socket auth error:', err);
      console.error('Token was:', token.substring(0, 50) + '...');
      // Allow connection even if auth fails for testing
      socket.user = {
        sub: 'anonymous',
        email: 'anonymous@test.com',
        role: 'USER',
      };
      console.log('Fallback to anonymous user due to auth error');
      next();
    }
  });

  // Online users tracking
  const onlineUsers = new Map<string, Set<string>>(); // userId -> Set of socket IDs

  io.on('connection', (socket: AuthenticatedSocket) => {
    console.log(`Socket connected: ${socket.id}, user: ${socket.user?.email}`);

    // Track online user
    if (socket.user) {
      if (!onlineUsers.has(socket.user.sub)) {
        onlineUsers.set(socket.user.sub, new Set());
      }
      onlineUsers.get(socket.user.sub)!.add(socket.id);
      
      // Broadcast user online status
      io.emit('user:online', { userId: socket.user.sub });
    }

    // Join chat room
    socket.on('chat:join', async (data: { chatRoomId: string }) => {
      try {
        const { chatRoomId } = data;
        socket.join(chatRoomId);
        console.log(`Socket ${socket.id} joined room ${chatRoomId}`);

        // Load recent messages
        const messages = await ChatMessageModel.find({ chatRoomId, isDeleted: false })
          .sort({ createdAt: -1 })
          .limit(50)
          .lean();

        socket.emit('chat:history', { chatRoomId, messages: messages.reverse() });
      } catch (error) {
        console.error('Error joining chat room:', error);
        socket.emit('error', { message: 'Failed to join chat room' });
      }
    });

    // Send chat message
    socket.on('chat:message', async (data: { 
      chatRoomId: string; 
      content: string;
      attachments?: Array<{
        url: string;
        fileName: string;
        fileSize: number;
        mimeType: string;
      }>;
    }) => {
      try {
        const { chatRoomId, content, attachments = [] } = data;
        
        if (!socket.user) {
          return socket.emit('error', { message: 'User not authenticated' });
        }

        // Determine message type based on attachments
        let messageType: 'text' | 'image' | 'file' = 'text';
        if (attachments.length > 0) {
          const firstAttachment = attachments[0];
          if (firstAttachment.mimeType.startsWith('image/')) {
            messageType = 'image';
          } else {
            messageType = 'file';
          }
        }

        // Create message
        const message = await ChatMessageModel.create({
          chatRoomId,
          senderId: socket.user.sub,
          senderName: socket.user.email.split('@')[0], // Simple name extraction
          content,
          type: messageType,
          attachments,
        });

        // Update chat room last message
        await ChatRoomModel.findByIdAndUpdate(chatRoomId, {
          lastMessage: {
            senderId: socket.user.sub,
            content: attachments.length > 0 ? `📎 ${attachments[0].fileName}` : content,
            timestamp: new Date(),
          },
        });

        // Broadcast to room
        io.to(chatRoomId).emit('chat:message', {
          message: {
            id: message._id.toString(),
            senderId: message.senderId,
            senderName: message.senderName,
            content: message.content,
            type: message.type,
            attachments: message.attachments || [],
            timestamp: message.createdAt,
            isRead: false,
          },
        });

        console.log(`Message sent in room ${chatRoomId} by ${socket.user.email}`);
      } catch (error) {
        console.error('Error sending message:', error);
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    // Typing indicator
    socket.on('chat:typing', (data: { chatRoomId: string; isTyping: boolean }) => {
      const { chatRoomId, isTyping } = data;
      if (socket.user) {
        socket.to(chatRoomId).emit('chat:typing', {
          userId: socket.user.sub,
          userName: socket.user.email.split('@')[0],
          isTyping,
        });
      }
    });

    // Join topic room (same as chat room, but for topic tab)
    socket.on('topic:join', async (data: { chatRoomId: string }) => {
      try {
        const { chatRoomId } = data;
        socket.join(`topic:${chatRoomId}`);
        console.log(`Socket ${socket.id} joined topic room ${chatRoomId}`);

        // Load recent posts
        const posts = await TopicPostModel.find({ chatRoomId, isDeleted: false })
          .sort({ createdAt: -1 })
          .limit(20)
          .lean();

        socket.emit('topic:history', { chatRoomId, posts });
      } catch (error) {
        console.error('Error joining topic room:', error);
        socket.emit('error', { message: 'Failed to join topic room' });
      }
    });

    // Create topic post
    socket.on('topic:post', async (data: { 
      chatRoomId: string; 
      category: 'quality' | 'schedule' | 'drawing' | 'others'; 
      content: string;
      attachments?: Array<{
        url: string;
        fileName: string;
        fileSize: number;
        mimeType: string;
      }>;
    }) => {
      try {
        const { chatRoomId, category, content, attachments } = data;
        
        if (!socket.user) {
          return socket.emit('error', { message: 'User not authenticated' });
        }

        // Create post
        const post = await TopicPostModel.create({
          chatRoomId,
          authorId: socket.user.sub,
          authorName: socket.user.email.split('@')[0],
          category,
          content,
          attachments: attachments || [],
        });

        // Broadcast to topic room
        io.to(`topic:${chatRoomId}`).emit('topic:post', {
          post: {
            id: post._id.toString(),
            authorId: post.authorId,
            authorName: post.authorName,
            category: post.category,
            content: post.content,
            attachments: post.attachments || [],
            comments: [],
            likes: [],
            approved: post.approved || false,
            approvedBy: post.approvedBy,
            approvedAt: post.approvedAt,
            approvalSignature: post.approvalSignature,
            timestamp: post.createdAt,
          },
        });

        console.log(`Topic post created in room ${chatRoomId} by ${socket.user.email}`);
      } catch (error) {
        console.error('Error creating topic post:', error);
        socket.emit('error', { message: 'Failed to create topic post' });
      }
    });

    // Add comment to topic post
    socket.on('topic:comment', async (data: { 
      postId: string; 
      content: string;
    }) => {
      try {
        const { postId, content } = data;
        
        if (!socket.user) {
          return socket.emit('error', { message: 'User not authenticated' });
        }

        const comment = {
          id: new Date().getTime().toString(),
          authorId: socket.user.sub,
          authorName: socket.user.email.split('@')[0],
          content,
          timestamp: new Date(),
          isDeleted: false,
        };

        // Add comment to post
        const post = await TopicPostModel.findByIdAndUpdate(
          postId,
          { $push: { comments: comment } },
          { new: true }
        );

        if (post) {
          // Broadcast to topic room
          io.to(`topic:${post.chatRoomId}`).emit('topic:comment', {
            postId,
            comment,
          });

          console.log(`Comment added to post ${postId} by ${socket.user.email}`);
        }
      } catch (error) {
        console.error('Error adding comment:', error);
        socket.emit('error', { message: 'Failed to add comment' });
      }
    });

    // Like/unlike topic post
    socket.on('topic:like', async (data: { postId: string }) => {
      try {
        const { postId } = data;
        
        if (!socket.user) {
          return socket.emit('error', { message: 'User not authenticated' });
        }

        const post = await TopicPostModel.findById(postId);
        if (!post) {
          return socket.emit('error', { message: 'Post not found' });
        }

        const hasLiked = post.likes.includes(socket.user.sub);
        
        // Toggle like
        const update = hasLiked
          ? { $pull: { likes: socket.user.sub } }
          : { $addToSet: { likes: socket.user.sub } };

        const updatedPost = await TopicPostModel.findByIdAndUpdate(
          postId,
          update,
          { new: true }
        );

        if (updatedPost) {
          // Broadcast to topic room
          io.to(`topic:${updatedPost.chatRoomId}`).emit('topic:like', {
            postId,
            likes: updatedPost.likes,
          });

          console.log(`Post ${postId} ${hasLiked ? 'unliked' : 'liked'} by ${socket.user.email}`);
        }
      } catch (error) {
        console.error('Error liking post:', error);
        socket.emit('error', { message: 'Failed to like post' });
      }
    });

    // Approve topic post (admin only)
    socket.on('topic:approve', async (data: { postId: string; signature?: string }) => {
      try {
        const { postId, signature } = data;
        
        if (!socket.user) {
          return socket.emit('error', { message: 'User not authenticated' });
        }

        // Check if user is admin
        if (socket.user.role !== 'ADMIN') {
          return socket.emit('error', { message: 'Only admins can approve posts' });
        }

        const post = await TopicPostModel.findById(postId);
        if (!post) {
          return socket.emit('error', { message: 'Post not found' });
        }

        // Toggle approve
        const isApproved = !post.approved;
        const update: any = {
          approved: isApproved,
        };

        if (isApproved) {
          update.approvedBy = socket.user.sub;
          update.approvedAt = new Date();
          update.approvalSignature = signature || null;
        } else {
          update.approvedBy = null;
          update.approvedAt = null;
          update.approvalSignature = null;
        }

        const updatedPost = await TopicPostModel.findByIdAndUpdate(
          postId,
          update,
          { new: true }
        );

        if (updatedPost) {
          // Broadcast to topic room
          io.to(`topic:${updatedPost.chatRoomId}`).emit('topic:approve', {
            postId,
            approved: isApproved,
            approvedBy: update.approvedBy,
            approvedAt: update.approvedAt,
            approvalSignature: update.approvalSignature,
          });

          console.log(`Post ${postId} ${isApproved ? 'approved' : 'unapproved'} by ${socket.user.email}`);
        }
      } catch (error) {
        console.error('Error approving post:', error);
        socket.emit('error', { message: 'Failed to approve post' });
      }
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      console.log(`Socket disconnected: ${socket.id}`);
      
      if (socket.user) {
        const userSockets = onlineUsers.get(socket.user.sub);
        if (userSockets) {
          userSockets.delete(socket.id);
          
          // If user has no more connections, mark as offline
          if (userSockets.size === 0) {
            onlineUsers.delete(socket.user.sub);
            io.emit('user:offline', { userId: socket.user.sub });
          }
        }
      }
    });
  });

  return io;
}

