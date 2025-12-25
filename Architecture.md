# Lumina E-commerce Architecture

## Overview
This document outlines the architecture for the Lumina E-commerce platform, focusing on a scalable frontend with a backend services architecture. The frontend is built with React and TypeScript, while the backend will provide RESTful APIs for all required functionality.

## Architecture Layers

### 1. Frontend Layer
- React 19 with TypeScript
- Zustand for state management
- Tailwind CSS for styling
- Vite for build tooling

### 2. Backend Services Layer
- RESTful API endpoints
- Authentication and authorization
- Database integration
- Payment processing
- File/image storage
- Search functionality
- Email notifications

### 3. Data Layer
- PostgreSQL for primary database
- Redis for caching
- Cloud storage for product images

## Backend Services Requirements

### 1. User Management Service
- User registration and authentication
- Profile management
- Role-based access control (user/admin)

### 2. Product Catalog Service
- Product CRUD operations
- Category management
- Product filtering and search
- Inventory management

### 3. Shopping Cart Service
- Cart operations (add, remove, update)
- Session management
- Cart persistence

### 4. Order Management Service
- Order creation and processing
- Order status tracking
- Order history for users

### 5. Payment Service
- Integration with payment gateways
- Transaction processing
- Refund handling

### 6. File Storage Service
- Product image upload and storage
- CDN integration for image delivery

### 7. Search Service
- Product search functionality
- Filter and sort capabilities

## API Endpoints Structure

### Authentication
- POST /api/auth/register
- POST /api/auth/login
- POST /api/auth/logout
- GET /api/auth/profile
- PUT /api/auth/profile

### Products
- GET /api/products
- GET /api/products/:id
- POST /api/products (admin only)
- PUT /api/products/:id (admin only)
- DELETE /api/products/:id (admin only)
- GET /api/products/search
- GET /api/products/categories

### Cart
- GET /api/cart
- POST /api/cart/items
- PUT /api/cart/items/:id
- DELETE /api/cart/items/:id
- DELETE /api/cart/clear

### Orders
- GET /api/orders
- GET /api/orders/:id
- POST /api/orders
- PUT /api/orders/:id/status (admin only)

### Wishlist
- GET /api/wishlist
- POST /api/wishlist
- DELETE /api/wishlist/:productId

### Admin
- GET /api/admin/dashboard/stats
- GET /api/admin/orders
- GET /api/admin/products
- GET /api/admin/users

## Frontend-Backend Integration

The frontend will consume these backend services through API calls. The state management in the frontend will be synchronized with backend data through these API endpoints.

## Component Mapping to Backend Services

Each frontend component will interact with specific backend services as outlined in the component documentation.