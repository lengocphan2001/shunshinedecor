import mongoose, { Schema, InferSchemaType, Model } from 'mongoose';
import { UserRole } from '../../domain/user';

const userSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, index: true },
    passwordHash: { type: String, required: true },
    fullName: { type: String, required: true },
    role: { type: String, enum: Object.values(UserRole), required: true, default: UserRole.STAFF },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export type UserDocument = InferSchemaType<typeof userSchema> & { _id: mongoose.Types.ObjectId };

const UserModel: Model<UserDocument> = mongoose.models.User || mongoose.model<UserDocument>('User', userSchema);
export default UserModel;


