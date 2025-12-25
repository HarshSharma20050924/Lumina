import prisma from '../prisma/prismaService';
import { Prisma, Category as PrismaCategory } from '@prisma/client';

export interface CategoryRepositoryInterface {
  create(data: {
    name: string;
    description?: string;
    parentId?: string;
  }): Promise<PrismaCategory>;
  findAll(): Promise<PrismaCategory[]>;
  findById(id: string): Promise<PrismaCategory | null>;
  findByName(name: string): Promise<PrismaCategory | null>;
  update(id: string, data: {
    name?: string;
    description?: string;
    parentId?: string;
  }): Promise<PrismaCategory>;
  delete(id: string): Promise<PrismaCategory>;
}

export class CategoryRepository implements CategoryRepositoryInterface {
  async create(data: {
    name: string;
    description?: string;
    parentId?: string;
  }): Promise<PrismaCategory> {
    return await prisma.category.create({
      data,
    });
  }

  async findAll(): Promise<PrismaCategory[]> {
    return await prisma.category.findMany({
      where: { parentId: null },
      include: {
        children: true,
        products: true,
      },
    });
  }

  async findById(id: string): Promise<PrismaCategory | null> {
    return await prisma.category.findUnique({
      where: { id },
      include: {
        children: true,
        products: true,
      },
    });
  }

  async findByName(name: string): Promise<PrismaCategory | null> {
    return await prisma.category.findUnique({
      where: { name },
    });
  }

  async update(id: string, data: {
    name?: string;
    description?: string;
    parentId?: string;
  }): Promise<PrismaCategory> {
    return await prisma.category.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<PrismaCategory> {
    return await prisma.category.delete({
      where: { id },
    });
  }
}