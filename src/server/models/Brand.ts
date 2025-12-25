import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface Brand {
  id: string;
  name: string;
  description?: string;
  logo?: string;
  website?: string;
  createdAt: Date;
  updatedAt: Date;
}

export class BrandModel {
  // Create a new brand
  static async create(data: {
    name: string;
    description?: string;
    logo?: string;
    website?: string;
  }): Promise<Brand> {
    return await prisma.brand.create({
      data,
    });
  }

  // Find all brands
  static async findAll(): Promise<Brand[]> {
    return await prisma.brand.findMany();
  }

  // Find brand by ID
  static async findById(id: string): Promise<Brand | null> {
    return await prisma.brand.findUnique({
      where: { id },
    });
  }

  // Find brand by name
  static async findByName(name: string): Promise<Brand | null> {
    return await prisma.brand.findUnique({
      where: { name },
    });
  }

  // Update brand
  static async update(id: string, data: {
    name?: string;
    description?: string;
    logo?: string;
    website?: string;
  }): Promise<Brand> {
    return await prisma.brand.update({
      where: { id },
      data,
    });
  }

  // Delete brand
  static async delete(id: string): Promise<Brand> {
    return await prisma.brand.delete({
      where: { id },
    });
  }
}