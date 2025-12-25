import { ProductRepository } from '../repository/productRepository';
import { Prisma, Product as PrismaProduct } from '@prisma/client';

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

type CreateProductInput = Prisma.ProductCreateInput;
type UpdateProductInput = Prisma.ProductUpdateInput;

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

export const getProductById = async (id: string): Promise<PrismaProduct | null> => {
  return await productRepository.findById(id);
};

export const createProduct = async (productData: CreateProductInput): Promise<PrismaProduct> => {
  return await productRepository.create(productData);
};

export const updateProduct = async (id: string, productData: UpdateProductInput): Promise<PrismaProduct | null> => {
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
  return await productRepository.getFeaturedProducts();
};

export const getCategories = async () => {
  // We'll need to implement this differently with Prisma
  // For now, returning empty arrays - this should be implemented with Prisma queries
  return {
    categories: [],
    subcategories: [],
    genders: []
  };
};