import mongoose, { Document, Schema } from 'mongoose';

export interface IOrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  selectedColor: string;
  selectedSize: string;
  image: string;
}

export type OrderStatus = 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface IOrder extends Document {
  userId: string;
  items: IOrderItem[];
  total: number;
  status: OrderStatus;
  shippingAddress: string;
  customerName: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema: Schema = new Schema({
  productId: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  selectedColor: { type: String, required: true },
  selectedSize: { type: String, required: true },
  image: { type: String, required: true },
});

const OrderSchema: Schema = new Schema(
  {
    userId: { type: String, required: true },
    items: [OrderItemSchema],
    total: { type: Number, required: true },
    status: { 
      type: String, 
      enum: ['processing', 'shipped', 'delivered', 'cancelled'], 
      default: 'processing' 
    },
    shippingAddress: { type: String, required: true },
    customerName: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IOrder>('Order', OrderSchema);