import mongoose, { Document, Schema } from 'mongoose';
import { IProduct } from './Product';

export interface ICartItem {
  productId: string;
  quantity: number;
  selectedColor: string;
  selectedSize: string;
}

export interface ICart extends Document {
  userId: string;
  items: ICartItem[];
  createdAt: Date;
  updatedAt: Date;
}

const CartItemSchema: Schema = new Schema({
  productId: { type: String, required: true },
  quantity: { type: Number, required: true, default: 1 },
  selectedColor: { type: String, required: true },
  selectedSize: { type: String, required: true },
});

const CartSchema: Schema = new Schema(
  {
    userId: { type: String, required: true, unique: true },
    items: [CartItemSchema],
  },
  { timestamps: true }
);

export default mongoose.model<ICart>('Cart', CartSchema);