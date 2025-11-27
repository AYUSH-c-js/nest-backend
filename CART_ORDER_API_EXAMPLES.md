# Cart & Order System - API Examples

## 🛒 Cart Endpoints

### 1. Get Cart
Get the current user's cart with all items and totals.

**Endpoint:** `GET /cart`

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "cart": {
    "id": 1,
    "user_id": 1,
    "items": [
      {
        "id": 1,
        "cart_id": 1,
        "product_id": 5,
        "quantity": 2,
        "product": {
          "id": 5,
          "name": "Laptop",
          "price": "999.99",
          "description": "High-performance laptop",
          "stock": 10,
          "image_url": "/uploads/laptop.jpg"
        }
      }
    ],
    "created_at": "2025-11-27T10:00:00.000Z",
    "updated_at": "2025-11-27T10:15:00.000Z"
  },
  "summary": {
    "subtotal": "1999.98",
    "tax": "199.99",
    "discount": "0.00",
    "total": "2199.97"
  }
}
```

---

### 2. Add Product to Cart
Add a product to cart or update quantity if already exists.

**Endpoint:** `POST /cart/add`

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "product_id": 5,
  "quantity": 2
}
```

**Response:**
```json
{
  "cart": {
    "id": 1,
    "user_id": 1,
    "items": [
      {
        "id": 1,
        "cart_id": 1,
        "product_id": 5,
        "quantity": 2,
        "product": {
          "id": 5,
          "name": "Laptop",
          "price": "999.99",
          "stock": 10
        }
      }
    ]
  },
  "summary": {
    "subtotal": "1999.98",
    "tax": "199.99",
    "discount": "0.00",
    "total": "2199.97"
  }
}
```

**Error Response (Insufficient Stock):**
```json
{
  "statusCode": 400,
  "message": "Insufficient stock. Only 5 items available",
  "error": "Bad Request"
}
```

---

### 3. Update Cart Item Quantity
Update the quantity of an existing cart item.

**Endpoint:** `PATCH /cart/items/:id`

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "quantity": 3
}
```

**Response:**
```json
{
  "cart": {
    "id": 1,
    "user_id": 1,
    "items": [
      {
        "id": 1,
        "quantity": 3,
        "product": {
          "name": "Laptop",
          "price": "999.99"
        }
      }
    ]
  },
  "summary": {
    "subtotal": "2999.97",
    "tax": "299.99",
    "discount": "0.00",
    "total": "3299.96"
  }
}
```

---

### 4. Remove Cart Item
Remove a specific item from the cart.

**Endpoint:** `DELETE /cart/items/:id`

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "cart": {
    "id": 1,
    "user_id": 1,
    "items": []
  },
  "summary": {
    "subtotal": "0.00",
    "tax": "0.00",
    "discount": "0.00",
    "total": "0.00"
  }
}
```

---

### 5. Clear Cart
Remove all items from the cart.

**Endpoint:** `DELETE /cart`

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "message": "Cart cleared successfully"
}
```

---

## 📦 Order Endpoints

### 1. Checkout (Create Order)
Convert cart to order, reduce stock, and generate invoice.

**Endpoint:** `POST /orders/checkout`

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "payment_method": "COD",
  "shipping_address": "123 Main Street, Apt 4B, New York, NY 10001",
  "phone": "+1-234-567-8900"
}
```

**Response:**
```json
{
  "message": "Order placed successfully",
  "order": {
    "id": 1,
    "user_id": 1,
    "order_number": "ORD-1732704000000-1",
    "status": "PENDING",
    "payment_method": "COD",
    "payment_status": false,
    "subtotal": "1999.98",
    "tax": "199.99",
    "discount": "0.00",
    "total": "2199.97",
    "shipping_address": "123 Main Street, Apt 4B, New York, NY 10001",
    "phone": "+1-234-567-8900",
    "invoice_path": "/path/to/invoices/invoice-ORD-1732704000000-1.pdf",
    "items": [
      {
        "id": 1,
        "order_id": 1,
        "product_id": 5,
        "product_name": "Laptop",
        "price": "999.99",
        "quantity": 2,
        "total": "1999.98"
      }
    ],
    "user": {
      "id": 1,
      "full_name": "John Doe",
      "email": "john@example.com"
    },
    "created_at": "2025-11-27T10:30:00.000Z"
  },
  "invoice_url": "/invoices/invoice-ORD-1732704000000-1.pdf"
}
```

**Error Response (Empty Cart):**
```json
{
  "statusCode": 400,
  "message": "Cart is empty",
  "error": "Bad Request"
}
```

**Error Response (Insufficient Stock):**
```json
{
  "statusCode": 400,
  "message": "Insufficient stock for Laptop. Only 1 available",
  "error": "Bad Request"
}
```

---

### 2. Get All Orders
Get all orders for the current user.

**Endpoint:** `GET /orders`

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response:**
```json
[
  {
    "id": 2,
    "order_number": "ORD-1732705000000-1",
    "status": "SHIPPED",
    "payment_method": "ONLINE",
    "payment_status": true,
    "total": "599.99",
    "created_at": "2025-11-27T11:00:00.000Z",
    "items": [
      {
        "product_name": "Wireless Mouse",
        "quantity": 1,
        "price": "49.99"
      }
    ]
  },
  {
    "id": 1,
    "order_number": "ORD-1732704000000-1",
    "status": "PENDING",
    "payment_method": "COD",
    "payment_status": false,
    "total": "2199.97",
    "created_at": "2025-11-27T10:30:00.000Z",
    "items": [
      {
        "product_name": "Laptop",
        "quantity": 2,
        "price": "999.99"
      }
    ]
  }
]
```

---

### 3. Get Order by ID
Get detailed information about a specific order.

**Endpoint:** `GET /orders/:id`

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "id": 1,
  "user_id": 1,
  "order_number": "ORD-1732704000000-1",
  "status": "PENDING",
  "payment_method": "COD",
  "payment_status": false,
  "subtotal": "1999.98",
  "tax": "199.99",
  "discount": "0.00",
  "total": "2199.97",
  "shipping_address": "123 Main Street, Apt 4B, New York, NY 10001",
  "phone": "+1-234-567-8900",
  "invoice_path": "/path/to/invoices/invoice-ORD-1732704000000-1.pdf",
  "items": [
    {
      "id": 1,
      "product_name": "Laptop",
      "price": "999.99",
      "quantity": 2,
      "total": "1999.98",
      "product": {
        "id": 5,
        "name": "Laptop",
        "stock": 8
      }
    }
  ],
  "user": {
    "id": 1,
    "full_name": "John Doe",
    "email": "john@example.com"
  },
  "created_at": "2025-11-27T10:30:00.000Z",
  "invoice_url": "/invoices/invoice-ORD-1732704000000-1.pdf"
}
```

---

### 4. Update Order Status (Admin)
Update the status of an order.

**Endpoint:** `PATCH /orders/:id/status`

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "status": "PAID"
}
```

**Valid Status Values:**
- `PENDING`
- `PAID`
- `SHIPPED`
- `COMPLETED`
- `CANCELLED`

**Response:**
```json
{
  "message": "Order status updated successfully",
  "order": {
    "id": 1,
    "order_number": "ORD-1732704000000-1",
    "status": "PAID",
    "payment_status": true,
    "total": "2199.97"
  }
}
```

---

### 5. Cancel Order
Cancel an order and restore product stock.

**Endpoint:** `POST /orders/:id/cancel`

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "message": "Order cancelled successfully",
  "order": {
    "id": 1,
    "order_number": "ORD-1732704000000-1",
    "status": "CANCELLED",
    "total": "2199.97"
  }
}
```

**Error Response (Already Shipped):**
```json
{
  "statusCode": 400,
  "message": "Cannot cancel order that has been shipped or completed",
  "error": "Bad Request"
}
```

---

## 🔄 Complete Checkout Flow Example

### Step 1: Register/Login
```bash
# Register
POST /auth/register
{
  "full_name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}

# Login
POST /auth/login
{
  "email": "john@example.com",
  "password": "securePassword123"
}

# Response includes JWT token
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Step 2: Browse Products
```bash
GET /products
```

### Step 3: Add Products to Cart
```bash
POST /cart/add
Authorization: Bearer <token>
{
  "product_id": 5,
  "quantity": 2
}

POST /cart/add
Authorization: Bearer <token>
{
  "product_id": 8,
  "quantity": 1
}
```

### Step 4: View Cart
```bash
GET /cart
Authorization: Bearer <token>
```

### Step 5: Update Cart (Optional)
```bash
# Update quantity
PATCH /cart/items/1
Authorization: Bearer <token>
{
  "quantity": 3
}

# Remove item
DELETE /cart/items/2
Authorization: Bearer <token>
```

### Step 6: Checkout
```bash
POST /orders/checkout
Authorization: Bearer <token>
{
  "payment_method": "COD",
  "shipping_address": "123 Main Street, Apt 4B, New York, NY 10001",
  "phone": "+1-234-567-8900"
}
```

### Step 7: View Order & Download Invoice
```bash
# Get order details
GET /orders/1
Authorization: Bearer <token>

# Download invoice (use invoice_url from response)
GET /invoices/invoice-ORD-1732704000000-1.pdf
```

---

## 📊 Business Logic Summary

### Cart System
- ✅ Each user has one cart
- ✅ Cart is created automatically on first add
- ✅ Adding existing product updates quantity
- ✅ Stock validation on add/update
- ✅ Automatic calculation of subtotal, tax (10%), discount, and total

### Order System
- ✅ Checkout converts cart to order atomically (transaction)
- ✅ Stock is reduced during checkout
- ✅ Cart is cleared after successful order
- ✅ Order number format: `ORD-{timestamp}-{userId}`
- ✅ Invoice PDF generated automatically
- ✅ Order items store product snapshot (price at time of order)

### Stock Management
- ✅ Stock checked before adding to cart
- ✅ Stock reduced during checkout (atomic transaction)
- ✅ Stock restored when order is cancelled
- ✅ Cannot cancel shipped/completed orders

### Invoice Generation
- ✅ PDF generated using PDFKit
- ✅ Includes order details, customer info, itemized list
- ✅ Stored in `/invoices` directory
- ✅ Accessible via static URL
- ✅ Order creation doesn't fail if invoice generation fails

---

## 🔐 Authentication

All cart and order endpoints require JWT authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

Get the token by logging in via `/auth/login`.
