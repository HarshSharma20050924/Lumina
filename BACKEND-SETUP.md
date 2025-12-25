# Backend Setup Guide

This document provides instructions for setting up and running the backend server for the e-commerce application.

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database
- npm or yarn package manager

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Set up Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/ecommerce_db"

# JWT
JWT_SECRET="your-super-secret-jwt-key"

# Server
PORT=5000
CLIENT_URL=http://localhost:3000

# Environment
NODE_ENV=development
```

### 3. Set up Database

#### Install Prisma (if not already installed)
```bash
npm install prisma --save-dev
```

#### Initialize Prisma (if running for the first time)
```bash
npx prisma init
```

#### Generate Prisma Client
```bash
npx prisma generate
```

#### Run Migrations
```bash
npx prisma migrate dev
```

#### Seed Database
```bash
npx prisma db seed
```

### 4. Running the Application

#### Development Mode
```bash
# Run the backend server in development mode
npm run server
```

#### Production Mode
```bash
# Run the backend server in production mode
npm run server:prod
```

## Project Structure

The backend follows a clean architecture pattern with the following layers:

- **Models**: Database schema definitions and entity models
- **Repositories**: Data access layer with database operations
- **Services**: Business logic layer
- **Controllers**: API request/response handling
- **Routes**: API endpoint definitions
- **Middleware**: Request processing and validation
- **Utils**: Helper functions and utilities

## Available Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/profile` - Get user profile

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `DELETE /api/users/:id` - Delete user
- `GET /api/users/` - List all users (admin only)

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create product (admin only)
- `PUT /api/products/:id` - Update product (admin only)
- `DELETE /api/products/:id` - Delete product (admin only)
- `GET /api/products/search` - Search products
- `GET /api/products/filter` - Filter products

### Cart
- `GET /api/cart` - Get user's cart
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/update` - Update cart item
- `DELETE /api/cart/remove` - Remove item from cart
- `DELETE /api/cart` - Clear cart

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders` - Get user's orders
- `GET /api/orders/:id` - Get order by ID
- `PUT /api/orders/:id` - Update order (admin only)
- `GET /api/orders/` - List all orders (admin only)

## API Documentation

For detailed API documentation, refer to the individual controller files in the `/src/server/controllers` directory.

## Database Models

- **User**: User account information
- **Product**: Product details and inventory
- **Category**: Product categories (with hierarchical structure)
- **Brand**: Product brands
- **Cart**: Shopping cart items
- **Order**: Order information and status
- **Wishlist**: User's saved products

## Security Features

- JWT-based authentication
- Input validation
- Rate limiting
- CORS configuration
- Helmet security headers
- Password hashing

## Error Handling

The application implements centralized error handling with appropriate HTTP status codes and meaningful error messages.

## Health Check

The application provides a health check endpoint:
- `GET /api/health` - Returns server status and timestamp