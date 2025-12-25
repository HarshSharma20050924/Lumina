import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  email: string;
  name: string;
  password?: string;
  role: 'user' | 'admin';
  avatar?: string;
  address?: string;
  phone?: string;
  wishlist?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    avatar: String,
    address: String,
    phone: String,
    wishlist: [{ type: String }] // Array of product IDs
  },
  { timestamps: true }
);

export default mongoose.model<IUser>('User', UserSchema);