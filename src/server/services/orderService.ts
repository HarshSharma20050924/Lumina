import { OrderRepository } from '../repository/orderRepository';
import { ProductRepository } from '../repository/productRepository';
import { UserRepository } from '../repository/userRepository';
import { IOrder, IOrderItem } from '../models/Order';
import Product from '../models/Product';
import Cart from '../models/Cart';

interface CreateOrderData {
  userId: string;
  items: IOrderItem[];
  total: number;
  shippingAddress: string;
  customerName: string;
}

const orderRepository = new OrderRepository();
const productRepository = new ProductRepository();
const userRepository = new UserRepository();

export const createOrder = async (orderData: CreateOrderData): Promise<IOrder> => {
  const { userId, items, total, shippingAddress, customerName } = orderData;

  // Validate products exist and have sufficient stock
  for (const item of items) {
    const product = await productRepository.findById(item.productId as string);
    if (!product) {
      throw new Error(`Product with ID ${item.productId} not found`);
    }
    if (product.stock !== undefined && product.stock < item.quantity) {
      throw new Error(`Insufficient stock for product ${product.name}`);
    }
  }

  // Create the order
  const order = await orderRepository.create({
    user: userId,
    items,
    totalAmount: total,
    shippingAddress,
    customerName,
    status: 'pending'
  });

  // Update product stock
  for (const item of items) {
    await productRepository.updateStock(item.productId as string, item.quantity);
  }

  // Clear the user's cart after successful order
  await Cart.deleteOne({ userId });

  return order;
};

export const getOrderByUserId = async (userId: string): Promise<IOrder[]> => {
  const result = await orderRepository.findByUserId(userId);
  return result.orders;
};

export const getOrderById = async (orderId: string): Promise<IOrder | null> => {
  return await orderRepository.findById(orderId);
};

export const updateOrderStatus = async (
  orderId: string, 
  status: 'processing' | 'shipped' | 'delivered' | 'cancelled'
): Promise<IOrder | null> => {
  return await orderRepository.updateStatus(orderId, status);
};

export const getAllOrders = async (): Promise<IOrder[]> => {
  const result = await orderRepository.findAll();
  return result.orders;
};

export const getOrdersByStatus = async (status: string): Promise<IOrder[]> => {
  const result = await orderRepository.findByStatus(status);
  return result.orders;
};

export const getUserOrderHistory = async (userId: string) => {
  const result = await orderRepository.findByUserId(userId);
  return result.orders;
};