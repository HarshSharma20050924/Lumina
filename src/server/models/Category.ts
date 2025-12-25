import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface Category {
  id: string;
  name: string;
  description?: string;
  parentId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export class CategoryModel {
  // Create a new category
  static async create(data: {
    name: string;
    description?: string;
    parentId?: string;
  }): Promise<Category> {
    return await prisma.category.create({
      data,
    });
  }

  // Find all categories
  static async findAll(): Promise<Category[]> {
    return await prisma.category.findMany({
      where: { parentId: null }, // Top-level categories
      include: {
        children: true, // Include subcategories if needed
      },
    });
  }

  // Find category by ID
  static async findById(id: string): Promise<Category | null> {
    return await prisma.category.findUnique({
      where: { id },
    });
  }

  // Find category by name
  static async findByName(name: string): Promise<Category | null> {
    return await prisma.category.findUnique({
      where: { name },
    });
  }

  // Update category
  static async update(id: string, data: {
    name?: string;
    description?: string;
    parentId?: string;
  }): Promise<Category> {
    return await prisma.category.update({
      where: { id },
      data,
    });
  }

  // Delete category
  static async delete(id: string): Promise<Category> {
    return await prisma.category.delete({
      where: { id },
    });
  }
}