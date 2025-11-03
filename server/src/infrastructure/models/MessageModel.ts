import mongoose, { Schema, InferSchemaType, Model } from 'mongoose';

// Message for chat tab - simple messages
const chatMessageSchema = new Schema(
  {
    chatRoomId: { type: Schema.Types.ObjectId, ref: 'ChatRoom', required: true },
    senderId: { type: String, required: true }, // user id or email
    senderName: { type: String, required: true },
    content: { type: String, required: true },
    type: { type: String, enum: ['text', 'image', 'file'], default: 'text' },
    attachments: [{
      url: String,
      fileName: String,
      fileSize: Number,
      mimeType: String,
    }],
    isDeleted: { type: Boolean, default: false },
    readBy: { type: [String], default: [] }, // array of user ids who read this message
  },
  { timestamps: true }
);

// Topic post for topic tab - posts with categories and comments
const topicPostSchema = new Schema(
  {
    chatRoomId: { type: Schema.Types.ObjectId, ref: 'ChatRoom', required: true },
    authorId: { type: String, required: true },
    authorName: { type: String, required: true },
    category: { 
      type: String, 
      enum: ['quality', 'schedule', 'drawing', 'others'], 
      required: true 
    },
    content: { type: String, required: true },
    attachments: [{
      url: String,
      fileName: String,
      fileSize: Number,
      mimeType: String,
    }],
    comments: [{
      id: { type: String, required: true },
      authorId: { type: String, required: true },
      authorName: { type: String, required: true },
      content: { type: String, required: true },
      timestamp: { type: Date, default: Date.now },
      isDeleted: { type: Boolean, default: false },
    }],
    likes: { type: [String], default: [] }, // array of user ids who liked this post
    approved: { type: Boolean, default: false },
    approvedBy: { type: String }, // admin user id who approved
    approvedAt: { type: Date },
    approvalSignature: { type: String }, // SVG path data for signature
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export type ChatMessageDocument = InferSchemaType<typeof chatMessageSchema> & { _id: mongoose.Types.ObjectId };
export type TopicPostDocument = InferSchemaType<typeof topicPostSchema> & { _id: mongoose.Types.ObjectId };

const ChatMessageModel: Model<ChatMessageDocument> = mongoose.models.ChatMessage || mongoose.model<ChatMessageDocument>('ChatMessage', chatMessageSchema);
const TopicPostModel: Model<TopicPostDocument> = mongoose.models.TopicPost || mongoose.model<TopicPostDocument>('TopicPost', topicPostSchema);

export { ChatMessageModel, TopicPostModel };

