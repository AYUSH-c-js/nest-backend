# Complete E-Commerce Frontend Prompt for NestJS Backend

## 🎯 Project Overview

Create a modern, responsive **React e-commerce frontend** with complete shopping cart and order management functionality. This application includes:

- ✅ User Authentication (Login/Register with profile)
- ✅ Hierarchical Category Management (with subcategories)
- ✅ Product Management (with multiple categories, stock tracking, images)
- ✅ **Shopping Cart System** (add/update/remove items)
- ✅ **Checkout & Order Management** (place orders, track status)
- ✅ **Invoice Download** (PDF invoices for orders)
- ✅ User Dashboard with statistics

---

## 🔌 Backend API Details

**Base URL:** `http://localhost:3000`

**Authentication:** JWT Bearer Token (stored in localStorage after login)

**Static Assets:**
- Product Images: `http://localhost:3000/uploads/{filename}`
- Invoices: `http://localhost:3000/invoices/invoice-{order_number}.pdf`

---

## 📡 Complete API Reference

### 1. Authentication Endpoints

#### Register
```http
POST /auth/register
Content-Type: application/json

{
  "full_name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}

Response:
{
  "access_token": "eyJhbGci...",
  "user": {
    "id": 1,
    "full_name": "John Doe",
    "email": "john@example.com",
    "phone": null,
    "address": null,
    "created_at": "2025-11-27T10:00:00.000Z"
  }
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}

Response: Same as register
```

---

### 2. Category Endpoints (Requires Auth)

All category endpoints require: `Authorization: Bearer <token>`

#### Get All Categories (Flat)
```http
GET /categories

Response: Array of categories with parent/children relations
```

#### Get Category Tree (Hierarchical)
```http
GET /categories/tree

Response: Nested tree structure
```

#### Create Category
```http
POST /categories
Content-Type: application/json

{
  "name": "Electronics",
  "parent_id": null  // or parent category ID
}
```

#### Update Category
```http
PATCH /categories/:id
Content-Type: application/json

{
  "name": "Updated Name",
  "parent_id": 2
}
```

#### Delete Category
```http
DELETE /categories/:id
```

---

### 3. Product Endpoints (Requires Auth)

#### Get All Products
```http
GET /products

Response:
[
  {
    "id": 1,
    "name": "Gaming Laptop",
    "price": "1200.00",
    "description": "High-performance laptop",
    "stock": 10,
    "image_url": "/uploads/laptop.jpg",
    "user_id": 1,
    "created_at": "2025-11-27T10:00:00.000Z",
    "categories": [
      {
        "id": 2,
        "name": "Laptops",
        "parent_id": 1
      }
    ]
  }
]
```

#### Get Single Product
```http
GET /products/:id
```

#### Create Product
```http
POST /products
Content-Type: application/json

{
  "name": "Gaming Laptop",
  "price": 1200,
  "description": "High-performance gaming laptop",
  "category_ids": [2, 5]
}
```

#### Update Product
```http
PATCH /products/:id
Content-Type: application/json

{
  "name": "Updated Name",
  "price": 1500,
  "description": "Updated description",
  "category_ids": [2, 3]
}
```

#### Delete Product
```http
DELETE /products/:id
```

---

### 4. 🛒 Cart Endpoints (Requires Auth)

#### Get Cart
```http
GET /cart
Authorization: Bearer <token>

Response:
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

#### Add to Cart
```http
POST /cart/add
Authorization: Bearer <token>
Content-Type: application/json

  {
    "product_id": 5,
    "quantity": 2
  }

Response: Updated cart with summary
```

#### Update Cart Item Quantity
```http
PATCH /cart/items/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "quantity": 3
}

Response: Updated cart with summary
```

#### Remove Cart Item
```http
DELETE /cart/items/:id
Authorization: Bearer <token>

Response: Updated cart
```

#### Clear Cart
```http
DELETE /cart
Authorization: Bearer <token>

Response: { "message": "Cart cleared successfully" }
```

---

### 5. 📦 Order Endpoints (Requires Auth)

#### Checkout (Create Order)
```http
POST /orders/checkout
Authorization: Bearer <token>
Content-Type: application/json

{
  "payment_method": "COD",  // or "ONLINE"
  "shipping_address": "123 Main St, City, State 12345",
  "phone": "+1234567890"
}

Response:
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
    "shipping_address": "123 Main St...",
    "phone": "+1234567890",
    "invoice_path": "/path/to/invoice.pdf",
    "items": [
      {
        "id": 1,
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

#### Get All Orders
```http
GET /orders
Authorization: Bearer <token>

Response: Array of orders (most recent first)
```

#### Get Order by ID
```http
GET /orders/:id
Authorization: Bearer <token>

Response: Order details with items and invoice_url
```

#### Update Order Status (Admin)
```http
PATCH /orders/:id/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "PAID"  // PENDING, PAID, SHIPPED, COMPLETED, CANCELLED
}
```

#### Cancel Order
```http
POST /orders/:id/cancel
Authorization: Bearer <token>

Response: { "message": "Order cancelled successfully", "order": {...} }
```

---

## 🎨 Frontend Requirements

### Technology Stack

**Required:**
- React 18+ with TypeScript (preferred) or JavaScript
- React Router v6 for navigation
- Axios or Fetch API for HTTP requests
- Context API or Redux/Zustand for state management
- Modern CSS framework: **TailwindCSS** (recommended) or Material-UI

**Recommended:**
- React Hook Form for form handling
- React Query (TanStack Query) for data fetching and caching
- React Toastify for notifications
- React Icons (lucide-react, react-icons)
- date-fns or dayjs for date formatting

---

## 📄 Pages & Features

### 1. 🔐 Authentication Pages

#### Login Page (`/login`)
- Email and password fields
- Form validation
- "Remember me" checkbox (optional)
- Link to register page
- Error handling for invalid credentials
- Redirect to dashboard on success

#### Register Page (`/register`)
- Full name, email, password fields
- Password confirmation
- Form validation
- Link to login page
- Auto-login after registration

---

### 2. 🏠 Public Pages (No Auth Required)

#### Home/Landing Page (`/`)
- Hero section with call-to-action
- Featured products (latest or popular)
- Category showcase
- "Shop Now" button → Products page

#### Products Browse Page (`/products`)
- Grid/list view of all products
- Filter by category (sidebar or dropdown)
- Search by product name
- Sort by: name, price (low-high, high-low), newest
- Product cards showing:
  - Product image (or placeholder)
  - Name
  - Price
  - Stock status (In Stock / Out of Stock)
  - "Add to Cart" button
  - "View Details" link

#### Product Detail Page (`/products/:id`)
- Large product image
- Product name, price, description
- Stock availability
- Category tags
- Quantity selector (1-stock max)
- "Add to Cart" button
- "Buy Now" button (add to cart + redirect to checkout)
- Related products (same category)

---

### 3. 🛒 Shopping Cart Page (`/cart`)

**Requires Authentication**

**Features:**
- List of cart items with:
  - Product image
  - Product name (link to detail)
  - Unit price
  - Quantity selector (update quantity)
  - Item total (price × quantity)
  - Remove button
- Cart summary sidebar:
  - Subtotal
  - Tax (10%)
  - Discount (if any)
  - **Total**
- "Continue Shopping" button
- "Proceed to Checkout" button (disabled if cart empty)
- Empty cart state with "Browse Products" link

**Cart Item Component:**
```
┌─────────────────────────────────────────────────┐
│ [Image] Gaming Laptop                  $999.99  │
│         In Stock: 10                             │
│         Qty: [−] 2 [+]        Total: $1,999.98  │
│         [Remove]                                 │
└─────────────────────────────────────────────────┘
```

---

### 4. 💳 Checkout Page (`/checkout`)

**Requires Authentication**

**Multi-step or Single Page Form:**

**Step 1: Shipping Information**
- Full Name (pre-filled from user profile)
- Phone Number (required)
- Shipping Address (textarea, required)
- Save to profile checkbox

**Step 2: Payment Method**
- Radio buttons:
  - Cash on Delivery (COD)
  - Online Payment (can be placeholder for now)

**Step 3: Order Review**
- List of items being ordered
- Shipping address confirmation
- Payment method confirmation
- Order summary (subtotal, tax, total)
- "Place Order" button

**After Order Placement:**
- Success message
- Order number display
- "View Order" button → Order details page
- "Download Invoice" button
- Cart is automatically cleared

---

### 5. 📋 Orders Page (`/orders`)

**Requires Authentication**

**Features:**
- List of all user orders (most recent first)
- Order cards/rows showing:
  - Order number
  - Order date
  - Status badge (color-coded)
  - Payment method
  - Total amount
  - "View Details" button
  - "Download Invoice" button (if available)
- Filter by status (All, Pending, Paid, Shipped, Completed, Cancelled)
- Search by order number

**Order Status Colors:**
- PENDING: Yellow/Orange
- PAID: Blue
- SHIPPED: Purple
- COMPLETED: Green
- CANCELLED: Red

---

### 6. 📦 Order Detail Page (`/orders/:id`)

**Requires Authentication**

**Features:**
- Order information:
  - Order number
  - Order date
  - Status (with timeline/stepper)
  - Payment method
  - Payment status
- Shipping information:
  - Address
  - Phone
- Order items table:
  - Product name
  - Quantity
  - Unit price
  - Total
- Order summary:
  - Subtotal
  - Tax
  - Discount
  - **Total**
- Action buttons:
  - "Download Invoice" (PDF)
  - "Cancel Order" (if status is PENDING or PAID)
  - "Track Order" (optional)

**Order Timeline Example:**
```
✓ Order Placed       Nov 27, 10:30 AM
✓ Payment Confirmed  Nov 27, 11:00 AM
→ Shipped           (In Progress)
  Delivered         (Pending)
```

---

### 7. 👤 User Profile Page (`/profile`)

**Requires Authentication**

**Features:**
- Display user information:
  - Full name
  - Email
  - Phone
  - Address
- Edit profile form
- Update password section
- Order statistics:
  - Total orders
  - Total spent
  - Recent orders (last 5)

---

### 8. 🎛️ Dashboard Layout (`/dashboard`)

**Admin/User Dashboard (Protected)**

**Layout Components:**
- Top navigation bar:
  - App logo/name
  - Search bar (global product search)
  - Cart icon with badge (item count)
  - User dropdown menu:
    - Profile
    - Orders
    - Logout
- Sidebar navigation:
  - Dashboard Home
  - Categories (admin)
  - Products (admin)
  - Orders
  - Profile

**Dashboard Home:**
- Statistics cards:
  - Total Products
  - Total Categories
  - Total Orders
  - Total Revenue (sum of completed orders)
- Recent orders table
- Quick actions:
  - Create Product
  - Create Category
  - View All Orders

---

### 9. 📂 Categories Management (`/dashboard/categories`)

**Admin Only**

**Features:**
- Hierarchical tree view
- Expand/collapse functionality
- Create root category
- Create subcategory
- Edit category
- Delete category (with cascade warning)
- Search/filter

---

### 10. 📦 Products Management (`/dashboard/products`)

**Admin Only**

**Features:**
- Product list/grid view
- Create product form:
  - Name, price, description
  - Stock quantity
  - Image upload (optional)
  - Multiple category selection
- Edit product
- Delete product
- Search and filter
- Stock management

---

## 🎨 UI/UX Design Guidelines

### Color Scheme
- **Primary:** #3B82F6 (Blue)
- **Secondary:** #8B5CF6 (Purple)
- **Success:** #10B981 (Green)
- **Warning:** #F59E0B (Orange)
- **Danger:** #EF4444 (Red)
- **Background:** #F9FAFB (Light Gray)
- **Text:** #1F2937 (Dark Gray)

### Component Styling
- Rounded corners (8px)
- Subtle shadows for cards
- Smooth transitions (200-300ms)
- Hover effects on interactive elements
- Consistent spacing (4px grid: 4, 8, 16, 24, 32, 48)

### Responsive Breakpoints
- Mobile: 320px - 767px
- Tablet: 768px - 1023px
- Desktop: 1024px+

### Icons
- Shopping cart, user, search, filter, sort
- Plus/minus for quantity
- Trash for delete
- Edit/pencil for edit
- Check/X for status

---

## 🗺️ Routing Structure

```
Public Routes:
/                          → Landing/Home page
/login                     → Login page
/register                  → Register page
/products                  → Browse products (public)
/products/:id              → Product detail (public)

Protected Routes (Require Auth):
/cart                      → Shopping cart
/checkout                  → Checkout page
/orders                    → User orders list
/orders/:id                → Order details
/profile                   → User profile

Admin Routes (Require Auth):
/dashboard                 → Dashboard home
/dashboard/categories      → Category management
/dashboard/products        → Product management
```

**Route Protection:**
- Redirect to `/login` if not authenticated
- Store intended URL and redirect after login

---

## 🔧 State Management

### Global State (Context/Redux/Zustand)

**AuthContext:**
- `user` (user object)
- `token` (JWT token)
- `login(email, password)`
- `register(userData)`
- `logout()`
- `isAuthenticated` (boolean)

**CartContext:**
- `cart` (cart object with items)
- `cartCount` (total items)
- `cartTotal` (total price)
- `addToCart(productId, quantity)`
- `updateCartItem(itemId, quantity)`
- `removeCartItem(itemId)`
- `clearCart()`
- `refreshCart()`

**Optional: ProductsContext, CategoriesContext**

---

## 📦 API Service Layer

Create organized API services:

```javascript
// api/auth.js
export const authAPI = {
  login: (email, password) => axios.post('/auth/login', { email, password }),
  register: (userData) => axios.post('/auth/register', userData),
};

// api/cart.js
export const cartAPI = {
  getCart: (token) => axios.get('/cart', { headers: { Authorization: `Bearer ${token}` } }),
  addToCart: (token, data) => axios.post('/cart/add', data, { headers: { Authorization: `Bearer ${token}` } }),
  updateItem: (token, itemId, quantity) => axios.patch(`/cart/items/${itemId}`, { quantity }, { headers: { Authorization: `Bearer ${token}` } }),
  removeItem: (token, itemId) => axios.delete(`/cart/items/${itemId}`, { headers: { Authorization: `Bearer ${token}` } }),
  clearCart: (token) => axios.delete('/cart', { headers: { Authorization: `Bearer ${token}` } }),
};

// api/orders.js
export const ordersAPI = {
  checkout: (token, data) => axios.post('/orders/checkout', data, { headers: { Authorization: `Bearer ${token}` } }),
  getOrders: (token) => axios.get('/orders', { headers: { Authorization: `Bearer ${token}` } }),
  getOrder: (token, orderId) => axios.get(`/orders/${orderId}`, { headers: { Authorization: `Bearer ${token}` } }),
  cancelOrder: (token, orderId) => axios.post(`/orders/${orderId}/cancel`, {}, { headers: { Authorization: `Bearer ${token}` } }),
};

// api/products.js
export const productsAPI = {
  getAll: () => axios.get('/products'),
  getById: (id) => axios.get(`/products/${id}`),
  create: (token, data) => axios.post('/products', data, { headers: { Authorization: `Bearer ${token}` } }),
  update: (token, id, data) => axios.patch(`/products/${id}`, data, { headers: { Authorization: `Bearer ${token}` } }),
  delete: (token, id) => axios.delete(`/products/${id}`, { headers: { Authorization: `Bearer ${token}` } }),
};
```

**Axios Configuration:**
```javascript
// api/axios.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000',
});

// Add token to all requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

---

## 🧪 Testing Checklist

### Authentication
- ✅ Register new user
- ✅ Login with valid credentials
- ✅ Login with invalid credentials (error)
- ✅ Logout
- ✅ Token persistence (refresh page)
- ✅ Protected route redirect

### Shopping Flow
- ✅ Browse products (public)
- ✅ View product details
- ✅ Add product to cart
- ✅ Update cart quantity
- ✅ Remove cart item
- ✅ View cart with totals
- ✅ Proceed to checkout
- ✅ Complete checkout
- ✅ View order confirmation
- ✅ Download invoice

### Order Management
- ✅ View all orders
- ✅ View order details
- ✅ Download invoice PDF
- ✅ Cancel order (PENDING/PAID only)
- ✅ Filter orders by status

### Stock Management
- ✅ Cannot add more than available stock
- ✅ Stock displays correctly
- ✅ Out of stock products disabled

### Responsive Design
- ✅ Mobile (320px)
- ✅ Tablet (768px)
- ✅ Desktop (1920px)

---

## 🚀 Quick Start

```bash
# Create React app with Vite (recommended)
npm create vite@latest ecommerce-frontend -- --template react
cd ecommerce-frontend

# Install dependencies
npm install react-router-dom axios react-toastify
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Optional: Additional packages
npm install react-hook-form react-query lucide-react

# Start development
npm run dev
```

---

## 📁 Suggested Folder Structure

```
src/
├── components/
│   ├── layout/
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   ├── Sidebar.jsx
│   │   └── DashboardLayout.jsx
│   ├── cart/
│   │   ├── CartItem.jsx
│   │   ├── CartSummary.jsx
│   │   └── EmptyCart.jsx
│   ├── products/
│   │   ├── ProductCard.jsx
│   │   ├── ProductList.jsx
│   │   ├── ProductFilter.jsx
│   │   └── ProductForm.jsx
│   ├── orders/
│   │   ├── OrderCard.jsx
│   │   ├── OrderList.jsx
│   │   ├── OrderTimeline.jsx
│   │   └── OrderSummary.jsx
│   ├── categories/
│   │   ├── CategoryTree.jsx
│   │   └── CategoryForm.jsx
│   └── common/
│       ├── Button.jsx
│       ├── Input.jsx
│       ├── Modal.jsx
│       ├── LoadingSpinner.jsx
│       └── Badge.jsx
├── pages/
│   ├── Home.jsx
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── Products.jsx
│   ├── ProductDetail.jsx
│   ├── Cart.jsx
│   ├── Checkout.jsx
│   ├── Orders.jsx
│   ├── OrderDetail.jsx
│   ├── Profile.jsx
│   └── dashboard/
│       ├── Dashboard.jsx
│       ├── Categories.jsx
│       └── ProductsManagement.jsx
├── context/
│   ├── AuthContext.jsx
│   └── CartContext.jsx
├── api/
│   ├── axios.js
│   ├── auth.js
│   ├── cart.js
│   ├── orders.js
│   ├── products.js
│   └── categories.js
├── hooks/
│   ├── useAuth.js
│   ├── useCart.js
│   └── useOrders.js
├── utils/
│   ├── formatters.js (currency, date)
│   └── validators.js
└── App.jsx
```

---

## 💡 Key Features to Implement

### 1. Cart Badge
- Show cart item count in navbar
- Update in real-time when items added/removed
- Animate on change

### 2. Stock Validation
- Disable "Add to Cart" if out of stock
- Show stock count on product cards
- Prevent adding more than available stock
- Show "Only X left!" warning

### 3. Order Status Timeline
- Visual stepper/timeline showing order progress
- Color-coded status badges
- Estimated delivery date (optional)

### 4. Invoice Download
- Button to download PDF invoice
- Opens in new tab
- Fallback if invoice not generated

### 5. Empty States
- Empty cart: "Your cart is empty" with shop button
- No orders: "You haven't placed any orders yet"
- No products: "No products found"

### 6. Loading States
- Skeleton loaders for product lists
- Spinner for buttons during submission
- Loading overlay for page transitions

### 7. Error Handling
- Toast notifications for errors
- Inline form validation errors
- Network error handling
- 404 page for invalid routes

---

## 🎯 Priority Features

### Must Have (MVP)
1. User authentication (login/register)
2. Browse products (public)
3. Add to cart
4. Checkout and place order
5. View orders
6. Download invoice

### Should Have
1. Product search and filter
2. Update cart quantities
3. Cancel orders
4. User profile management
5. Order status tracking

### Nice to Have
1. Product reviews
2. Wishlist
3. Order tracking with carrier
4. Email notifications
5. Multiple addresses
6. Coupon codes

---

## 📝 Important Notes

1. **CORS:** Backend has CORS enabled
2. **Ports:** Backend on 3000, frontend on different port (5173 for Vite, 3001 for CRA)
3. **Token Storage:** Store JWT in localStorage with key `access_token`
4. **Stock:** Products have `stock` field - validate before adding to cart
5. **Order Status:** PENDING → PAID → SHIPPED → COMPLETED (or CANCELLED)
6. **Payment Methods:** COD and ONLINE (ONLINE can be placeholder)
7. **Tax:** Currently 10% of subtotal
8. **Invoice:** Generated automatically on order creation

---

## 🎨 Design Inspiration

**Look at these for inspiration:**
- Amazon (product listing, cart, checkout)
- Shopify stores (clean product pages)
- Stripe Checkout (payment flow)
- Tailwind UI E-commerce components

**Focus on:**
- Clean, modern design
- Intuitive navigation
- Clear call-to-action buttons
- Mobile-first responsive design
- Fast loading times
- Smooth animations

---

## ✅ Final Deliverables

1. Fully functional React e-commerce application
2. Complete shopping cart system
3. Order placement and management
4. User authentication and profile
5. Admin dashboard (categories, products)
6. Responsive design (mobile, tablet, desktop)
7. Error handling and loading states
8. Clean, maintainable code
9. README with setup instructions

---

## 📚 Additional Resources

- **Backend API Examples:** See `CART_ORDER_API_EXAMPLES.md`
- **Backend URL:** `http://localhost:3000`
- **Create test user via:** `/auth/register`

---

**🎉 Build an amazing e-commerce experience! Focus on user-friendly shopping flow, clear product presentation, and seamless checkout process.**
