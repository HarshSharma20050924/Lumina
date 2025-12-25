import { Order } from '../models/Order';
import { Document, Types } from 'mongoose';

// Define the Order document type
interface OrderDocument extends Order, Document {
  _id: Types.ObjectId;
}

export class OrderRepository {
  // Create a new order
  async create(orderData: Partial<Order>): Promise<OrderDocument> {
    const order = new Order(orderData);
    return await order.save();
  }

  // Find order by ID
  async findById(id: string): Promise<OrderDocument | null> {
    return await Order.findById(id)
      .populate('user', 'name email')
      .populate('items.product', 'name price')
      .lean();
  }

  // Find order by order number
  async findByOrderNumber(orderNumber: string): Promise<OrderDocument | null> {
    return await Order.findOne({ orderNumber })
      .populate('user', 'name email')
      .populate('items.product', 'name price')
      .lean();
  }

  // Find orders by user ID
  async findByUserId(userId: string, page: number = 1, limit: number = 10): Promise<{ orders: OrderDocument[]; total: number }> {
    const skip = (page - 1) * limit;
    const orders = await Order.find({ user: userId })
      .populate('items.product', 'name price')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();
    const total = await Order.countDocuments({ user: userId });
    return { orders, total };
  }

  // Find all orders with pagination and filtering
  async findAll(
    page: number = 1,
    limit: number = 10,
    filters: { status?: string; dateFrom?: string; dateTo?: string; userId?: string } = {}
  ): Promise<{ orders: OrderDocument[]; total: number }> {
    const skip = (page - 1) * limit;
    
    let query: any = {};
    
    // Apply status filter
    if (filters.status) {
      query.status = filters.status;
    }
    
    // Apply date range filter
    if (filters.dateFrom || filters.dateTo) {
      query.createdAt = {};
      if (filters.dateFrom) query.createdAt.$gte = new Date(filters.dateFrom);
      if (filters.dateTo) query.createdAt.$lte = new Date(filters.dateTo);
    }
    
    // Apply user filter
    if (filters.userId) {
      query.user = filters.userId;
    }
    
    const orders = await Order.find(query)
      .populate('user', 'name email')
      .populate('items.product', 'name price')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();
    
    const total = await Order.countDocuments(query);
    
    return { orders, total };
  }

  // Update order by ID
  async updateById(id: string, updateData: Partial<Order>): Promise<OrderDocument | null> {
    return await Order.findByIdAndUpdate(id, updateData, { new: true })
      .populate('user', 'name email')
      .populate('items.product', 'name price')
      .lean();
  }

  // Update order status
  async updateStatus(orderId: string, status: string): Promise<OrderDocument | null> {
    return await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    )
    .populate('user', 'name email')
    .populate('items.product', 'name price')
    .lean();
  }

  // Add tracking information to order
  async addTrackingInfo(orderId: string, trackingNumber: string, carrier: string): Promise<OrderDocument | null> {
    return await Order.findByIdAndUpdate(
      orderId,
      { 
        trackingNumber,
        carrier,
        shippedAt: new Date()
      },
      { new: true }
    )
    .populate('user', 'name email')
    .populate('items.product', 'name price')
    .lean();
  }

  // Delete order by ID
  async deleteById(id: string): Promise<boolean> {
    const result = await Order.findByIdAndDelete(id);
    return !!result;
  }

  // Find orders by status
  async findByStatus(status: string, page: number = 1, limit: number = 10): Promise<{ orders: OrderDocument[]; total: number }> {
    const skip = (page - 1) * limit;
    const orders = await Order.find({ status }).skip(skip).limit(limit).lean();
    const total = await Order.countDocuments({ status });
    return { orders, total };
  }

  // Calculate total revenue
  async calculateTotalRevenue(): Promise<number> {
    const result = await Order.aggregate([
      {
        $match: { status: { $in: ['delivered', 'completed'] } }
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$totalAmount' }
        }
      }
    ]);
    
    return result[0]?.totalRevenue || 0;
  }

  // Get order statistics
  async getOrderStats(): Promise<{
    totalOrders: number;
    pendingOrders: number;
    processingOrders: number;
    shippedOrders: number;
    deliveredOrders: number;
    totalRevenue: number;
  }> {
    const [
      totalOrders,
      pendingOrders,
      processingOrders,
      shippedOrders,
      deliveredOrders,
      totalRevenue
    ] = await Promise.all([
      Order.countDocuments(),
      Order.countDocuments({ status: 'pending' }),
      Order.countDocuments({ status: 'processing' }),
      Order.countDocuments({ status: 'shipped' }),
      Order.countDocuments({ status: 'delivered' }),
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