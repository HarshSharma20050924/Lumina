import prisma from '../prisma/prismaService';
import { Prisma, Order as PrismaOrder } from '@prisma/client';

export class OrderRepository {
  // Create a new order
  async create(orderData: Prisma.OrderCreateInput): Promise<PrismaOrder> {
    return await prisma.order.create({
      data: orderData,
    });
  }

  // Find order by ID
  async findById(id: string) {
    return await prisma.order.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
        orderItems: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                price: true,
                discountPrice: true,
              },
            },
          },
        },
      },
    });
  }

  // Find order by order number
  async findByOrderNumber(orderNumber: string) {
    return await prisma.order.findUnique({
      where: { orderNumber },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
        orderItems: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                price: true,
                discountPrice: true,
              },
            },
          },
        },
      },
    });
  }

  // Find orders by user ID
  async findByUserId(userId: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    
    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where: { userId },
        skip,
        take: limit,
        include: {
          orderItems: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  price: true,
                  discountPrice: true,
                },
              },
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      prisma.order.count({
        where: { userId },
      }),
    ]);

    return { orders, total };
  }

  // Find all orders with pagination and filtering
  async findAll(
    page: number = 1,
    limit: number = 10,
    filters: { status?: string; dateFrom?: string; dateTo?: string; userId?: string } = {}
  ) {
    const skip = (page - 1) * limit;
    
    const whereClause: Prisma.OrderWhereInput = {};
    
    // Apply status filter
    if (filters.status) {
      whereClause.status = filters.status;
    }
    
    // Apply date range filter
    if (filters.dateFrom || filters.dateTo) {
      whereClause.createdAt = {};
      if (filters.dateFrom) whereClause.createdAt.gte = new Date(filters.dateFrom);
      if (filters.dateTo) whereClause.createdAt.lte = new Date(filters.dateTo);
    }
    
    // Apply user filter
    if (filters.userId) {
      whereClause.userId = filters.userId;
    }
    
    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where: whereClause,
        skip,
        take: limit,
        include: {
          user: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
            },
          },
          orderItems: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  price: true,
                  discountPrice: true,
                },
              },
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      prisma.order.count({
        where: whereClause,
      }),
    ]);

    return { orders, total };
  }

  // Update order by ID
  async updateById(id: string, updateData: Prisma.OrderUpdateInput) {
    return await prisma.order.update({
      where: { id },
      data: updateData,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
        orderItems: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                price: true,
                discountPrice: true,
              },
            },
          },
        },
      },
    });
  }

  // Update order status
  async updateStatus(orderId: string, status: string) {
    return await prisma.order.update({
      where: { id: orderId },
      data: { status },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
        orderItems: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                price: true,
                discountPrice: true,
              },
            },
          },
        },
      },
    });
  }

  // Add tracking information to order
  async addTrackingInfo(orderId: string, trackingNumber: string, carrier: string) {
    return await prisma.order.update({
      where: { id: orderId },
      data: {
        trackingNumber,
        carrier,
        shippedAt: new Date(),
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
        orderItems: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                price: true,
                discountPrice: true,
              },
            },
          },
        },
      },
    });
  }

  // Delete order by ID
  async deleteById(id: string): Promise<boolean> {
    try {
      await prisma.order.delete({
        where: { id },
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  // Find orders by status
  async findByStatus(status: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    
    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where: { status },
        skip,
        take: limit,
        include: {
          user: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
            },
          },
          orderItems: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  price: true,
                  discountPrice: true,
                },
              },
            },
          },
        },
      }),
      prisma.order.count({
        where: { status },
      }),
    ]);

    return { orders, total };
  }

  // Calculate total revenue
  async calculateTotalRevenue(): Promise<number> {
    const result = await prisma.order.aggregate({
      _sum: {
        totalAmount: true,
      },
      where: {
        status: {
          in: ['delivered', 'completed'],
        },
      },
    });
    
    return result._sum.totalAmount || 0;
  }

  // Get order statistics
  async getOrderStats() {
    const [
      totalOrders,
      pendingOrders,
      processingOrders,
      shippedOrders,
      deliveredOrders,
      totalRevenue
    ] = await Promise.all([
      prisma.order.count(),
      prisma.order.count({ where: { status: 'pending' } }),
      prisma.order.count({ where: { status: 'processing' } }),
      prisma.order.count({ where: { status: 'shipped' } }),
      prisma.order.count({ where: { status: 'delivered' } }),
      this.calculateTotalRevenue()
    ]);

    return {
      totalOrders,
      pendingOrders,
      processingOrders,
      shippedOrders,
      deliveredOrders,
      totalRevenue
    };
  }
}