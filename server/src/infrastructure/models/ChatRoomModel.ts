import mongoose, { Schema, InferSchemaType, Model } from 'mongoose';

const chatRoomSchema = new Schema(
  {
    name: { type: String, required: true },
    projectId: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
    participants: { type: [String], default: [], required: true }, // user ids or emails
    lastMessage: {
      type: new Schema(
        {
          senderId: { type: String },
          content: { type: String },
          timestamp: { type: Date },
        },
        { _id: false }
      ),
      default: null,
    },
    unreadCountMap: { type: Map, of: Number, default: {} }, // key: userId -> count
  },
  { timestamps: true }
);

export type ChatRoomDocument = InferSchemaType<typeof chatRoomSchema> & { _id: mongoose.Types.ObjectId };

const ChatRoomModel: Model<ChatRoomDocument> = mongoose.models.ChatRoom || mongoose.model<ChatRoomDocument>('ChatRoom', chatRoomSchema);
export default ChatRoomModel;


