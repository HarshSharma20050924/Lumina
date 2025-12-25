import Order, { IOrder, IOrderItem } from '../models/Order';
import Product from '../models/Product';
import Cart from '../models/Cart';
import { ICart } from '../models/Cart';

interface CreateOrderData {
  userId: string;
  items: IOrderItem[];
  total: number;
  shippingAddress: string;
  customerName: string;
}

export const createOrder = async (orderData: CreateOrderData): Promise<IOrder> => {
  const { userId, items, total, shippingAddress, customerName } = orderData;

  // Validate products exist and have sufficient stock
  for (const item of items) {
    const product = await Product.findById(item.productId);
    if (!product) {
      throw new Error(`Product with ID ${item.productId} not found`);
    }
    if (product.stock !== undefined && product.stock < item.quantity) {
      throw new Error(`Insufficient stock for product ${product.name}`);
    }
  }

  // Create the order
  const order = new Order({
    userId,
    items,
    total,
    shippingAddress,
    customerName
  });

  const savedOrder = await order.save();

  // Update product stock
  for (const item of items) {
    await Product.findByIdAndUpdate(
      item.productId,
      { $inc: { stock: -item.quantity } }
    );
  }

  // Clear the user's cart after successful order
  await Cart.deleteOne({ userId });

  return savedOrder;
};

export const getOrderByUserId = async (userId: string): Promise<IOrder[]> => {
  return await Order.find({ userId }).sort({ createdAt: -1 });
};

export const getOrderById = async (orderId: string): Promise<IOrder | null> => {
  return await Order.findById(orderId);
};

export const updateOrderStatus = async (
  orderId: string, 
  status: 'processing' | 'shipped' | 'delivered' | 'cancelled'
): Promise<IOrder | null> => {
  return await Order.findByIdAndUpdate(
    orderId,
    { status },
    { new: true }
  );
};

export const getAllOrders = async (): Promise<IOrder[]> => {
  return await Order.find().sort({ createdAt: -1 });
};

export const getOrdersByStatus = async (status: string): Promise<IOrder[]> => {
  return await Order.find({ status });
};

export const getUserOrderHistory = async (userId: string) => {
  const orders = await Order.find({ userId }).sort({ createdAt: -1 });
  return orders;
};