import mongoose, { Document, Schema } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  price: number;
  category: string;
  gender?: 'Men' | 'Women' | 'Kids' | 'Unisex';
  subcategory?: string;
  image: string;
  hoverImage: string;
  isNew?: boolean;
  isSale?: boolean;
  discountPrice?: number;
  rating: number;
  reviewCount: number;
  colors: string[];
  sizes: string[];
  description: string;
  stock?: number;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    gender: { type: String, enum: ['Men', 'Women', 'Kids', 'Unisex'] },
    subcategory: String,
    image: { type: String, required: true },
    hoverImage: { type: String, required: true },
    isNew: Boolean,
    isSale: Boolean,
    discountPrice: Number,
    rating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
    colors: [String],
    sizes: [String],
    description: { type: String, required: true },
    stock: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model<IProduct>('Product', ProductSchema);