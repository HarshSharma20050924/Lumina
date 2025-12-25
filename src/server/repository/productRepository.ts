import prisma from '../prisma/prismaService';
import { Prisma, Product as PrismaProduct } from '@prisma/client';

export class ProductRepository {
  // Create a new product
  async create(productData: Prisma.ProductCreateInput): Promise<PrismaProduct> {
    return await prisma.product.create({
      data: productData,
    });
  }

  // Find product by ID
  async findById(id: string): Promise<PrismaProduct | null> {
    return await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        brand: true,
      },
    });
  }

  // Find all products with pagination and filtering
  async findAll(
    page: number = 1, 
    limit: number = 10,
    filters: {
      categoryId?: string;
      brandId?: string;
      inStock?: boolean;
      search?: string;
    } = {}
  ): Promise<{ products: PrismaProduct[]; total: number }> {
    const skip = (page - 1) * limit;
    
    const whereClause: Prisma.ProductWhereInput = {};
    
    if (filters.categoryId) {
      whereClause.categoryId = filters.categoryId;
    }
    
    if (filters.brandId) {
      whereClause.brandId = filters.brandId;
    }
    
    if (filters.inStock !== undefined) {
      whereClause.inStock = filters.inStock;
    }
    
    if (filters.search) {
      whereClause.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where: whereClause,
        skip,
        take: limit,
        include: {
          category: true,
          brand: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      prisma.product.count({
        where: whereClause,
      }),
    ]);

    return { products, total };
  }

  // Update product by ID
  async updateById(id: string, updateData: Prisma.ProductUpdateInput): Promise<PrismaProduct | null> {
    return await prisma.product.update({
      where: { id },
      data: updateData,
    });
  }

  // Delete product by ID
  async deleteById(id: string): Promise<boolean> {
    try {
      await prisma.product.delete({
        where: { id },
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  // Get products by category
  async findByCategory(categoryId: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where: { categoryId },
        skip,
        take: limit,
        include: {
          category: true,
          brand: true,
        },
      }),
      prisma.product.count({
        where: { categoryId },
      }),
    ]);

    return { products, total };
  }

  // Get products by brand
  async findByBrand(brandId: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where: { brandId },
        skip,
        take: limit,
        include: {
          category: true,
          brand: true,
        },
      }),
      prisma.product.count({
        where: { brandId },
      }),
    ]);

    return { products, total };
  }

  // Get featured products (top selling or most popular)
  async getFeaturedProducts(limit: number = 8) {
    return await prisma.product.findMany({
      where: {
        inStock: true,
      },
      take: limit,
      include: {
        category: true,
        brand: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  // Update product stock
  async updateStock(productId: string, newStock: number): Promise<PrismaProduct | null> {
    return await prisma.product.update({
      where: { id: productId },
      data: {
        stockCount: newStock,
        inStock: newStock > 0,
      },
    });
  }

  // Reduce stock by quantity
  async reduceStock(productId: string, quantity: number): Promise<PrismaProduct | null> {
    const product = await this.findById(productId);
    if (!product) return null;
    
    if (product.stockCount < quantity) {
      throw new Error(`Insufficient stock for product ${productId}`);
    }

    return await prisma.product.update({
      where: { id: productId },
      data: {
        stockCount: product.stockCount - quantity,
        inStock: (product.stockCount - quantity) > 0,
      },
    });
  }
}