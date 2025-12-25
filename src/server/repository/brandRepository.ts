import prisma from '../prisma/prismaService';
import { Prisma, Brand as PrismaBrand } from '@prisma/client';

export interface BrandRepositoryInterface {
  create(data: {
    name: string;
    description?: string;
    logo?: string;
    website?: string;
  }): Promise<PrismaBrand>;
  findAll(): Promise<PrismaBrand[]>;
  findById(id: string): Promise<PrismaBrand | null>;
  findByName(name: string): Promise<PrismaBrand | null>;
  update(id: string, data: {
    name?: string;
    description?: string;
    logo?: string;
    website?: string;
  }): Promise<PrismaBrand>;
  delete(id: string): Promise<PrismaBrand>;
}

export class BrandRepository implements BrandRepositoryInterface {
  async create(data: {
    name: string;
    description?: string;
    logo?: string;
    website?: string;
  }): Promise<PrismaBrand> {
    return await prisma.brand.create({
      data,
    });
  }

  async findAll(): Promise<PrismaBrand[]> {
    return await prisma.brand.findMany({
      include: {
        products: true,
      },
    });
  }

  async findById(id: string): Promise<PrismaBrand | null> {
    return await prisma.brand.findUnique({
      where: { id },
      include: {
        products: true,
      },
    });
  }

  async findByName(name: string): Promise<PrismaBrand | null> {
    return await prisma.brand.findUnique({
      where: { name },
    });
  }

  async update(id: string, data: {
    name?: string;
    description?: string;
    logo?: string;
    website?: string;
  }): Promise<PrismaBrand> {
    return await prisma.brand.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<PrismaBrand> {
    return await prisma.brand.delete({
      where: { id },
    });
  }
}