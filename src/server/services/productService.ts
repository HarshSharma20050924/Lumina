import { ProductRepository } from '../repository/productRepository';
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

const productRepository = new ProductRepository();

export const getAllProducts = async (filters: ProductFilters = {}, page: number = 1, limit: number = 10) => {
  const result = await productRepository.findAll(page, limit, {
    category: filters.category,
    minPrice: filters.minPrice,
    maxPrice: filters.maxPrice,
    search: filters.search
  });

  return {
    products: result.products,
    total: result.total,
    page,
    limit,
    totalPages: Math.ceil(result.total / limit)
  };
};

export const getProductById = async (id: string): Promise<IProduct | null> => {
  return await productRepository.findById(id);
};

export const createProduct = async (productData: Partial<IProduct>): Promise<IProduct> => {
  return await productRepository.create(productData);
};

export const updateProduct = async (id: string, productData: Partial<IProduct>): Promise<IProduct | null> => {
  return await productRepository.updateById(id, productData);
};

export const deleteProduct = async (id: string): Promise<boolean> => {
  return await productRepository.deleteById(id);
};

export const getProductsByCategory = async (category: string) => {
  const result = await productRepository.findByCategory(category);
  return result.products;
};

export const getFeaturedProducts = async () => {
  return await productRepository.findFeatured();
};

export const getCategories = async () => {
  // Since category data is not in the product repository, we'll need to adjust this
  // For now, we'll keep the original implementation for getting distinct values
  const ProductModel = (await import('../models/Product')).default;
  const categories = await ProductModel.distinct('category');
  const subcategories = await ProductModel.distinct('subcategory');
  const genders = await ProductModel.distinct('gender');
  
  return {
    categories: categories.filter(cat => cat !== undefined),
    subcategories: subcategories.filter(sub => sub !== undefined),
    genders: genders.filter(gender => gender !== undefined)
  };
};