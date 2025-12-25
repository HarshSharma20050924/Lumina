import { PrismaClient, Brand } from '@prisma/client';

const prisma = new PrismaClient();

export interface BrandRepositoryInterface {
  create(data: {
    name: string;
    description?: string;
    logo?: string;
    website?: string;
  }): Promise<Brand>;
  findAll(): Promise<Brand[]>;
  findById(id: string): Promise<Brand | null>;
  findByName(name: string): Promise<Brand | null>;
  update(id: string, data: {
    name?: string;
    description?: string;
    logo?: string;
    website?: string;
  }): Promise<Brand>;
  delete(id: string): Promise<Brand>;
}

export class BrandRepository implements BrandRepositoryInterface {
  async create(data: {
    name: string;
    description?: string;
    logo?: string;
    website?: string;
  }): Promise<Brand> {
    return await prisma.brand.create({
      data,
    });
  }

  async findAll(): Promise<Brand[]> {
    return await prisma.brand.findMany({
      include: {
        products: true,
      },
    });
  }

  async findById(id: string): Promise<Brand | null> {
    return await prisma.brand.findUnique({
      where: { id },
      include: {
        products: true,
      },
    });
  }

  async findByName(name: string): Promise<Brand | null> {
    return await prisma.brand.findUnique({
      where: { name },
    });
  }

  async update(id: string, data: {
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

  async delete(id: string): Promise<Brand> {
    return await prisma.brand.delete({
      where: { id },
    });
  }
}