import { OrderRepository } from '../repository/orderRepository';
import { ProductRepository } from '../repository/productRepository';
import { UserRepository } from '../repository/userRepository';

const orderRepository = new OrderRepository();
const productRepository = new ProductRepository();
const userRepository = new UserRepository();

export const getDashboardStatsService = async () => {
  // Get order statistics
  const orderStats = await orderRepository.getOrderStats();
  
  // Get product count - we need to update ProductRepository to support this
  const totalProducts = await productRepository.findAll(1, 1); // Just to get total count
  const totalProductCount = totalProducts.total;
  
  // Get user count - we need to update UserRepository to support this
  const totalUsers = await userRepository.findAll(1, 1); // Just to get total count
  const totalUserCount = totalUsers.total;
  
  // Get recent orders (last 5) - update to use repository method
  const recentOrdersResult = await orderRepository.findAll(1, 5);
  const recentOrders = recentOrdersResult.orders;
  
  return {
    ...orderStats,
    totalProducts: totalProductCount,
    totalUsers: totalUserCount,
    recentOrders
  };
};

export const getAdminOrdersService = async () => {
  const result = await orderRepository.findAll(1, 50); // Get first 50 orders
  return result.orders;
};

export const getAdminProductsService = async () => {
  const result = await productRepository.findAll(1, 50); // Get first 50 products
  return result.products;
};

export const getAdminUsersService = async () => {
  const result = await userRepository.findAll(1, 50); // Get first 50 users
  return result.users;
};