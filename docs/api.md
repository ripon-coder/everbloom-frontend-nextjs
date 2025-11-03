# API Documentation

This document describes the API endpoints used in the Everbloom e-commerce application.

## Base URL
```
/api
```

## Authentication Endpoints

### POST /api/auth/login
Login user with email and password.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "1",
      "email": "user@example.com",
      "name": "User Name",
      "role": "user"
    },
    "token": "jwt_token_here"
  }
}
```

### POST /api/auth/register
Register a new user.

**Request Body:**
```json
{
  "name": "User Name",
  "email": "user@example.com",
  "password": "password123"
}
```

### POST /api/auth/logout
Logout the current user.

## Product Endpoints

### GET /api/products
Get products with optional filtering.

**Query Parameters:**
- `category` (string): Filter by category slug
- `brand` (string): Filter by brand slug
- `min_price` (number): Minimum price filter
- `max_price` (number): Maximum price filter
- `page` (number): Page number (default: 1)
- `per_page` (number): Items per page (default: 10)

**Response:**
```json
{
  "success": true,
  "data": {
    "products": [...],
    "pagination": {
      "current_page": 1,
      "last_page": 5,
      "per_page": 10,
      "total": 50
    }
  }
}
```

### GET /api/product?slug=:slug
Get a single product by slug.

## Cart Endpoints

### GET /api/cart
Get current user's cart.

### POST /api/cart/add
Add item to cart.

**Request Body:**
```json
{
  "productId": "1",
  "quantity": 2,
  "variant": "size-large"
}
```

### PUT /api/cart/update/:itemId
Update cart item quantity.

### DELETE /api/cart/remove/:itemId
Remove item from cart.

### DELETE /api/cart/clear
Clear entire cart.

## Checkout Endpoints

### POST /api/checkout/create-order
Create a new order.

**Request Body:**
```json
{
  "items": [...],
  "shippingAddress": {...},
  "billingAddress": {...},
  "paymentMethod": {...}
}
```