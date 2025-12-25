import { Product } from '../models/Product';
import { Document, Types } from 'mongoose';

// Define the Product document type
interface ProductDocument extends Product, Document {
  _id: Types.ObjectId;
}

export class ProductRepository {
  // Create a new product
  async create(productData: Partial<Product>): Promise<ProductDocument> {
    const product = new Product(productData);
    return await product.save();
  }

  // Find product by ID
  async findById(id: string): Promise<ProductDocument | null> {
    return await Product.findById(id).populate('category').lean();
  }

  // Find product by slug
  async findBySlug(slug: string): Promise<ProductDocument | null> {
    return await Product.findOne({ slug }).populate('category').lean();
  }

  // Find all products with pagination and filtering
  async findAll(
    page: number = 1, 
    limit: number = 10,
    filters: { category?: string; minPrice?: number; maxPrice?: number; search?: string } = {}
  ): Promise<{ products: ProductDocument[]; total: number }> {
    const skip = (page - 1) * limit;
    
    let query: any = {};
    
    // Apply category filter
    if (filters.category) {
      query.category = filters.category;
    }
    
    // Apply price range filter
    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
      query.price = {};
      if (filters.minPrice !== undefined) query.price.$gte = filters.minPrice;
      if (filters.maxPrice !== undefined) query.price.$lte = filters.maxPrice;
    }
    
    // Apply search filter
    if (filters.search) {
      query.$or = [
        { name: { $regex: filters.search, $options: 'i' } },
        { description: { $regex: filters.search, $options: 'i' } },
        { 'tags': { $in: [new RegExp(filters.search, 'i')] } }
      ];
    }
    
    const products = await Product.find(query)
      .populate('category')
      .skip(skip)
      .limit(limit)
      .lean();
    
    const total = await Product.countDocuments(query);
    
    return { products, total };
  }

  // Update product by ID
  async updateById(id: string, updateData: Partial<Product>): Promise<ProductDocument | null> {
    return await Product.findByIdAndUpdate(id, updateData, { new: true }).populate('category').lean();
  }

  // Delete product by ID
  async deleteById(id: string): Promise<boolean> {
    const result = await Product.findByIdAndDelete(id);
    return !!result;
  }

  // Update product stock
  async updateStock(productId: string, quantity: number): Promise<ProductDocument | null> {
    return await Product.findByIdAndUpdate(
      productId,
      { $inc: { stock: -quantity, sold: quantity } },
      { new: true }
    ).lean();
  }

  // Find products by category
  async findByCategory(categoryId: string, page: number = 1, limit: number = 10): Promise<{ products: ProductDocument[]; total: number }> {
    const skip = (page - 1) * limit;
    const products = await Product.find({ category: categoryId }).skip(skip).limit(limit).lean();
    const total = await Product.countDocuments({ category: categoryId });
    return { products, total };
  }

  // Find featured products
  async findFeatured(limit: number = 8): Promise<ProductDocument[]> {
    return await Product.find({ featured: true }).limit(limit).lean();
  }

  // Find products on sale
  async findOnSale(limit: number = 8): Promise<ProductDocument[]> {
    return await Product.find({ salePrice: { $exists: true, $ne: null } }).limit(limit).lean();
  }

  // Find related products
  async findRelated(productId: string, categoryId: string, limit: number = 4): Promise<ProductDocument[]> {
    return await Product.find({
      _id: { $ne: productId },
      category: categoryId
    }).limit(limit).lean();
  }
}