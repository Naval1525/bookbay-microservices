import mongoose, { Document, Schema } from 'mongoose';
export interface IUser extends Document{
    email: string;
    password: string;
    name: string;
    role: string;
    createdAt: Date;
}

const userSchema = new Schema<IUser>({
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: true,
      minlength: 6
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  });

  export const User = mongoose.model<IUser>('User', userSchema);