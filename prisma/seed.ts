import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create default categories
  const electronicsCategory = await prisma.category.upsert({
    where: { name: 'Electronics' },
    update: {},
    create: {
      name: 'Electronics',
      description: 'Electronic devices and gadgets',
    },
  });

  const clothingCategory = await prisma.category.upsert({
    where: { name: 'Clothing' },
    update: {},
    create: {
      name: 'Clothing',
      description: 'Apparel and fashion items',
    },
  });

  const booksCategory = await prisma.category.upsert({
    where: { name: 'Books' },
    update: {},
    create: {
      name: 'Books',
      description: 'Books and educational materials',
    },
  });

  // Create default brands
  const appleBrand = await prisma.brand.upsert({
    where: { name: 'Apple' },
    update: {},
    create: {
      name: 'Apple',
      description: 'Technology company known for premium devices',
      website: 'https://www.apple.com',
    },
  });

  const nikeBrand = await prisma.brand.upsert({
    where: { name: 'Nike' },
    update: {},
    create: {
      name: 'Nike',
      description: 'Global brand for sports and lifestyle products',
      website: 'https://www.nike.com',
    },
  });

  const randomBrand = await prisma.brand.upsert({
    where: { name: 'Random House' },
    update: {},
    create: {
      name: 'Random House',
      description: 'Leading book publishing company',
      website: 'https://www.randomhouse.com',
    },
  });

  // Create sample products
  await prisma.product.createMany({
    data: [
      {
        name: 'iPhone 15 Pro',
        description: 'Latest iPhone with advanced camera system',
        price: 999.99,
        discountPrice: 949.99,
        images: ['https://example.com/iphone15.jpg'],
        inStock: true,
        stockCount: 50,
        categoryId: electronicsCategory.id,
        brandId: appleBrand.id,
      },
      {
        name: 'Nike Air Max',
        description: 'Comfortable running shoes with air cushioning',
        price: 129.99,
        images: ['https://example.com/nikeairmax.jpg'],
        inStock: true,
        stockCount: 100,
        categoryId: clothingCategory.id,
        brandId: nikeBrand.id,
      },
      {
        name: 'The Great Gatsby',
        description: 'Classic novel by F. Scott Fitzgerald',
        price: 14.99,
        images: ['https://example.com/gatsby.jpg'],
        inStock: true,
        stockCount: 200,
        categoryId: booksCategory.id,
        brandId: randomBrand.id,
      },
    ],
    skipDuplicates: true,
  });

  console.log('Seed data created successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });