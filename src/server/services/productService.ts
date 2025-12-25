import Product from '../models/Product';
import { IProduct } from '../models/Product';

interface ProductFilters {
  category?: string;
  gender?: string;
  subcategory?: string;
  minPrice?: number;
  maxPrice?: number;
  colors?: string[];
  sizes?: string[];
  search?: string;
}

export const getAllProducts = async (filters: ProductFilters = {}, page: number = 1, limit: number = 10) => {
  const query: any = {};

  // Apply filters
  if (filters.category) query.category = filters.category;
  if (filters.gender) query.gender = filters.gender;
  if (filters.subcategory) query.subcategory = filters.subcategory;
  if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
    query.price = {};
    if (filters.minPrice !== undefined) query.price.$gte = filters.minPrice;
    if (filters.maxPrice !== undefined) query.price.$lte = filters.maxPrice;
  }
  if (filters.colors && filters.colors.length > 0) {
    query.colors = { $in: filters.colors };
  }
  if (filters.sizes && filters.sizes.length > 0) {
    query.sizes = { $in: filters.sizes };
  }
  if (filters.search) {
    query.$or = [
      { name: { $regex: filters.search, $options: 'i' } },
      { description: { $regex: filters.search, $options: 'i' } }
    ];
  }

  const skip = (page - 1) * limit;
  const products = await Product.find(query).skip(skip).limit(limit);
  const total = await Product.countDocuments(query);

  return {
    products,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit)
  };
};

export const getProductById = async (id: string): Promise<IProduct | null> => {
  return await Product.findById(id);
};

export const createProduct = async (productData: Partial<IProduct>): Promise<IProduct> => {
  const product = new Product(productData);
  return await product.save();
};

export const updateProduct = async (id: string, productData: Partial<IProduct>): Promise<IProduct | null> => {
  return await Product.findByIdAndUpdate(id, productData, { new: true });
};

export const deleteProduct = async (id: string): Promise<boolean> => {
  const result = await Product.findByIdAndDelete(id);
  return !!result;
};

export const getProductsByCategory = async (category: string) => {
  return await Product.find({ category });
};

export const getFeaturedProducts = async () => {
  return await Product.find({}).limit(8);
};

export const getCategories = async () => {
  const categories = await Product.distinct('category');
  const subcategories = await Product.distinct('subcategory');
  const genders = await Product.distinct('gender');
  
  return {
    categories: categories.filter(cat => cat !== undefined),
    subcategories: subcategories.filter(sub => sub !== undefined),
    genders: genders.filter(gender => gender !== undefined)
  };
};