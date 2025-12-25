import { PrismaClient, Category } from '@prisma/client';

const prisma = new PrismaClient();

export interface CategoryRepositoryInterface {
  create(data: {
    name: string;
    description?: string;
    parentId?: string;
  }): Promise<Category>;
  findAll(): Promise<Category[]>;
  findById(id: string): Promise<Category | null>;
  findByName(name: string): Promise<Category | null>;
  update(id: string, data: {
    name?: string;
    description?: string;
    parentId?: string;
  }): Promise<Category>;
  delete(id: string): Promise<Category>;
}

export class CategoryRepository implements CategoryRepositoryInterface {
  async create(data: {
    name: string;
    description?: string;
    parentId?: string;
  }): Promise<Category> {
    return await prisma.category.create({
      data,
    });
  }

  async findAll(): Promise<Category[]> {
    return await prisma.category.findMany({
      where: { parentId: null },
      include: {
        children: true,
        products: true,
      },
    });
  }

  async findById(id: string): Promise<Category | null> {
    return await prisma.category.findUnique({
      where: { id },
      include: {
        children: true,
        products: true,
      },
    });
  }

  async findByName(name: string): Promise<Category | null> {
    return await prisma.category.findUnique({
      where: { name },
    });
  }

  async update(id: string, data: {
    name?: string;
    description?: string;
    parentId?: string;
  }): Promise<Category> {
    return await prisma.category.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<Category> {
    return await prisma.category.delete({
      where: { id },
    });
  }
}