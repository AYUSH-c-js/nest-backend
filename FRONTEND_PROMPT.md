# Frontend Generation Prompt for NestJS Product Management System

## Project Overview

Create a modern, responsive React frontend application for a Product Management System with the following features:
- User Authentication (Login/Register)
- Hierarchical Category Management (with subcategories)
- Product Management (with multiple categories per product)
- User Dashboard

---

## Backend API Details

**Base URL:** `http://localhost:3000`

**Authentication:** JWT Bearer Token (stored in localStorage after login)

---

## API Endpoints

### Authentication Endpoints

#### 1. Register
```
POST /auth/register
Content-Type: application/json

Request Body:
{
  "full_name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}

Response:
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "full_name": "John Doe",
    "email": "john@example.com",
    "created_at": "2025-11-26T10:00:00.000Z"
  }
}
```

#### 2. Login
```
POST /auth/login
Content-Type: application/json

Request Body:
{
  "email": "john@example.com",
  "password": "password123"
}

Response:
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "full_name": "John Doe",
    "email": "john@example.com"
  }
}
```

---

### Category Endpoints (Requires Authentication)

**Headers Required:**
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

#### 1. Get All Categories (Flat List)
```
GET /categories

Response:
[
  {
    "id": 1,
    "name": "Electronics",
    "user_id": 1,
    "parent_id": null,
    "created_at": "2025-11-26T10:00:00.000Z",
    "parent": null,
    "children": [
      {
        "id": 2,
        "name": "Laptops",
        "user_id": 1,
        "parent_id": 1,
        "created_at": "2025-11-26T10:01:00.000Z"
      }
    ]
  }
]
```

#### 2. Get Category Tree (Hierarchical)
```
GET /categories/tree

Response:
[
  {
    "id": 1,
    "name": "Electronics",
    "user_id": 1,
    "parent_id": null,
    "created_at": "2025-11-26T10:00:00.000Z",
    "children": [
      {
        "id": 2,
        "name": "Laptops",
        "user_id": 1,
        "parent_id": 1,
        "created_at": "2025-11-26T10:01:00.000Z",
        "children": [
          {
            "id": 5,
            "name": "Gaming Laptops",
            "user_id": 1,
            "parent_id": 2,
            "created_at": "2025-11-26T10:02:00.000Z",
            "children": []
          }
        ]
      }
    ]
  }
]
```

#### 3. Create Category
```
POST /categories

Request Body (Root Category):
{
  "name": "Electronics"
}

Request Body (Subcategory):
{
  "name": "Laptops",
  "parent_id": 1
}

Response:
{
  "id": 2,
  "name": "Laptops",
  "user_id": 1,
  "parent_id": 1,
  "created_at": "2025-11-26T10:01:00.000Z"
}
```

#### 4. Update Category
```
PATCH /categories/:id

Request Body:
{
  "name": "Updated Name",
  "parent_id": 2
}

Response:
{
  "id": 5,
  "name": "Updated Name",
  "user_id": 1,
  "parent_id": 2,
  "created_at": "2025-11-26T10:02:00.000Z"
}
```

#### 5. Delete Category
```
DELETE /categories/:id

Response: 200 OK
Note: Deleting a parent category will cascade delete all its subcategories
```

---

### Product Endpoints (Requires Authentication)

#### 1. Get All Products
```
GET /products

Response:
[
  {
    "id": 1,
    "name": "Gaming Laptop",
    "price": 1200,
    "description": "High-performance gaming laptop",
    "user_id": 1,
    "created_at": "2025-11-26T10:05:00.000Z",
    "categories": [
      {
        "id": 2,
        "name": "Laptops",
        "user_id": 1,
        "parent_id": 1,
        "created_at": "2025-11-26T10:01:00.000Z"
      },
      {
        "id": 5,
        "name": "Gaming Laptops",
        "user_id": 1,
        "parent_id": 2,
        "created_at": "2025-11-26T10:02:00.000Z"
      }
    ]
  }
]
```

#### 2. Get Single Product
```
GET /products/:id

Response: Same as single product object above
```

#### 3. Create Product
```
POST /products

Request Body:
{
  "name": "Gaming Laptop",
  "price": 1200,
  "description": "High-performance gaming laptop with RTX 4080",
  "category_ids": [2, 5]
}

Response:
{
  "id": 1,
  "name": "Gaming Laptop",
  "price": 1200,
  "description": "High-performance gaming laptop with RTX 4080",
  "user_id": 1,
  "created_at": "2025-11-26T10:05:00.000Z",
  "categories": [...]
}
```

#### 4. Update Product
```
PATCH /products/:id

Request Body (can update any field):
{
  "name": "Updated Product Name",
  "price": 1500,
  "description": "Updated description",
  "category_ids": [2, 3, 5]
}

Response: Updated product object
```

#### 5. Delete Product
```
DELETE /products/:id

Response: 200 OK
```

---

## Frontend Requirements

### Technology Stack

**Required:**
- React 18+ (with TypeScript preferred)
- React Router for navigation
- Axios or Fetch for API calls
- Context API or Redux for state management
- Modern CSS framework (TailwindCSS, Material-UI, or Ant Design)

**Recommended:**
- React Hook Form for form handling
- React Query (TanStack Query) for data fetching and caching
- React Toastify for notifications
- React Icons for icons

---

### Pages & Features

#### 1. Authentication Pages

**Login Page (`/login`)**
- Email and password fields
- Form validation
- "Remember me" checkbox (optional)
- Link to register page
- Error handling for invalid credentials
- Redirect to dashboard on success

**Register Page (`/register`)**
- Full name, email, and password fields
- Password confirmation field
- Form validation (email format, password strength)
- Link to login page
- Error handling for duplicate email
- Auto-login after registration

---

#### 2. Dashboard Layout (`/dashboard`)

**Layout Components:**
- Top navigation bar with:
  - App logo/name
  - User name display
  - Logout button
- Sidebar navigation with links to:
  - Dashboard Home
  - Categories
  - Products
  - Profile (optional)

---

#### 3. Categories Page (`/dashboard/categories`)

**Features:**
- Display categories in hierarchical tree view
- Visual indentation for subcategories
- Expand/collapse functionality for parent categories
- Action buttons for each category:
  - Edit (opens modal/form)
  - Delete (with confirmation)
  - Add Subcategory
- "Create Root Category" button
- Search/filter functionality

**Category Tree Display Example:**
```
📁 Electronics
  📁 Laptops
    📄 Gaming Laptops
    📄 Business Laptops
  📁 Smartphones
    📄 Android
    📄 iOS
📁 Clothing
  📄 Men's Wear
  📄 Women's Wear
```

**Create/Edit Category Modal:**
- Name field (required)
- Parent category dropdown (optional, for creating subcategories)
- Save and Cancel buttons
- Validation feedback

---

#### 4. Products Page (`/dashboard/products`)

**Features:**
- Product list/grid view with:
  - Product name
  - Price (formatted as currency)
  - Description (truncated)
  - Categories (displayed as tags/badges)
  - Edit and Delete buttons
- "Create Product" button
- Search functionality (by name)
- Filter by category (dropdown or checkboxes)
- Sort options (by name, price, date)

**Product Card/Row Display:**
```
┌─────────────────────────────────────────┐
│ Gaming Laptop                  $1,200   │
│ High-performance gaming laptop...       │
│ 🏷️ Laptops  🏷️ Gaming Laptops          │
│ [Edit] [Delete]                         │
└─────────────────────────────────────────┘
```

**Create/Edit Product Form:**
- Name field (required)
- Price field (required, number input)
- Description field (required, textarea)
- Category selection (multi-select dropdown or checkboxes)
  - Display categories in hierarchical format
  - Allow selecting multiple categories
- Save and Cancel buttons
- Validation feedback

---

#### 5. Dashboard Home (`/dashboard`)

**Statistics Cards:**
- Total Products count
- Total Categories count
- Recent Products (last 5)
- Recent Categories (last 5)

**Quick Actions:**
- Create Product button
- Create Category button

---

### UI/UX Requirements

#### Design Principles
1. **Modern & Clean:** Use a professional color scheme (e.g., blue/purple primary, white/gray backgrounds)
2. **Responsive:** Mobile-first design, works on all screen sizes
3. **Intuitive:** Clear navigation, obvious action buttons
4. **Feedback:** Loading states, success/error messages, confirmations for destructive actions

#### Color Scheme Suggestion
- Primary: #3B82F6 (Blue)
- Secondary: #8B5CF6 (Purple)
- Success: #10B981 (Green)
- Danger: #EF4444 (Red)
- Background: #F9FAFB (Light Gray)
- Text: #1F2937 (Dark Gray)

#### Component Styling
- Rounded corners (border-radius: 8px)
- Subtle shadows for cards
- Smooth transitions and hover effects
- Consistent spacing (use 4px/8px/16px/24px/32px grid)

---

### State Management

**Global State (Context/Redux):**
- User authentication state (user object, token)
- Categories list (for reuse across components)
- Products list

**Local State:**
- Form inputs
- Modal open/close states
- Loading states
- Error states

---

### API Integration

**Create an API service layer:**

```javascript
// Example: api/auth.js
export const authAPI = {
  login: async (email, password) => {
    const response = await fetch('http://localhost:3000/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    return response.json();
  },
  register: async (full_name, email, password) => {
    const response = await fetch('http://localhost:3000/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ full_name, email, password })
    });
    return response.json();
  }
};

// Example: api/categories.js
export const categoriesAPI = {
  getAll: async (token) => {
    const response = await fetch('http://localhost:3000/categories', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.json();
  },
  getTree: async (token) => {
    const response = await fetch('http://localhost:3000/categories/tree', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.json();
  },
  create: async (token, data) => {
    const response = await fetch('http://localhost:3000/categories', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    return response.json();
  },
  update: async (token, id, data) => {
    const response = await fetch(`http://localhost:3000/categories/${id}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    return response.json();
  },
  delete: async (token, id) => {
    await fetch(`http://localhost:3000/categories/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
  }
};

// Similar structure for productsAPI
```

---

### Routing Structure

```
/                          → Landing/Login page
/login                     → Login page
/register                  → Register page
/dashboard                 → Dashboard home (protected)
/dashboard/categories      → Categories management (protected)
/dashboard/products        → Products management (protected)
/dashboard/profile         → User profile (protected, optional)
```

**Protected Routes:** Redirect to `/login` if not authenticated

---

### Error Handling

**Handle these scenarios:**
1. Network errors (API unavailable)
2. Authentication errors (401 - redirect to login)
3. Validation errors (400 - display field errors)
4. Not found errors (404)
5. Server errors (500)

**Display errors using:**
- Toast notifications for global errors
- Inline error messages for form validation
- Error boundaries for component crashes

---

### Additional Features (Optional but Recommended)

1. **Loading States:**
   - Skeleton loaders for lists
   - Spinner for buttons during submission
   - Progress bars for page transitions

2. **Confirmation Dialogs:**
   - Confirm before deleting categories/products
   - Warn about cascade delete for parent categories

3. **Search & Filter:**
   - Real-time search for products/categories
   - Filter products by multiple categories
   - Sort products by name/price/date

4. **Pagination:**
   - If product list grows large
   - Load more or page-based pagination

5. **Form Enhancements:**
   - Auto-save drafts (localStorage)
   - Clear form button
   - Keyboard shortcuts (Ctrl+S to save)

6. **Accessibility:**
   - Proper ARIA labels
   - Keyboard navigation
   - Focus management in modals

---

## Example Component Structure

```
src/
├── components/
│   ├── layout/
│   │   ├── Navbar.jsx
│   │   ├── Sidebar.jsx
│   │   └── DashboardLayout.jsx
│   ├── categories/
│   │   ├── CategoryTree.jsx
│   │   ├── CategoryTreeItem.jsx
│   │   ├── CategoryForm.jsx
│   │   └── CategoryModal.jsx
│   ├── products/
│   │   ├── ProductList.jsx
│   │   ├── ProductCard.jsx
│   │   ├── ProductForm.jsx
│   │   └── ProductModal.jsx
│   ├── common/
│   │   ├── Button.jsx
│   │   ├── Input.jsx
│   │   ├── Modal.jsx
│   │   ├── LoadingSpinner.jsx
│   │   └── ConfirmDialog.jsx
│   └── auth/
│       ├── LoginForm.jsx
│       └── RegisterForm.jsx
├── pages/
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── Dashboard.jsx
│   ├── Categories.jsx
│   └── Products.jsx
├── context/
│   └── AuthContext.jsx
├── api/
│   ├── auth.js
│   ├── categories.js
│   └── products.js
├── utils/
│   ├── formatters.js (price formatting, date formatting)
│   └── validators.js (form validation helpers)
├── hooks/
│   ├── useAuth.js
│   ├── useCategories.js
│   └── useProducts.js
└── App.jsx
```

---

## Testing Checklist

After building the frontend, test these scenarios:

### Authentication
- ✅ Register new user
- ✅ Login with valid credentials
- ✅ Login with invalid credentials (should show error)
- ✅ Logout
- ✅ Access protected route without login (should redirect)
- ✅ Token persistence (refresh page while logged in)

### Categories
- ✅ Create root category
- ✅ Create subcategory (2-3 levels deep)
- ✅ Edit category name
- ✅ Move category to different parent
- ✅ Delete leaf category (no children)
- ✅ Delete parent category (should show cascade warning)
- ✅ View category tree (expand/collapse)

### Products
- ✅ Create product with single category
- ✅ Create product with multiple categories
- ✅ Edit product details
- ✅ Update product categories
- ✅ Delete product
- ✅ Filter products by category
- ✅ Search products by name

### UI/UX
- ✅ Responsive on mobile (320px width)
- ✅ Responsive on tablet (768px width)
- ✅ Responsive on desktop (1920px width)
- ✅ Loading states display correctly
- ✅ Error messages are clear
- ✅ Success notifications appear
- ✅ Forms validate before submission

---

## Quick Start Commands

```bash
# Create React app
npx create-react-app product-management-frontend
cd product-management-frontend

# Install dependencies
npm install react-router-dom axios react-toastify react-icons

# Optional: Install TailwindCSS
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Start development server
npm start
```

---

## Important Notes

1. **CORS:** Backend already has CORS enabled (`app.enableCors()`)
2. **Port:** Backend runs on port 3000, frontend should run on different port (default 3000 for React, use 3001 or change)
3. **Token Storage:** Store JWT token in localStorage with key `access_token`
4. **Token Expiry:** Handle 401 responses by redirecting to login
5. **Category IDs:** When creating/updating products, send array of category IDs: `category_ids: [1, 2, 3]`
6. **Cascade Delete:** Warn users that deleting a parent category will delete all subcategories

---

## Example Screenshots/Mockups to Aim For

**Login Page:**
- Centered card with logo
- Email and password inputs
- Login button
- Link to register

**Dashboard:**
- Sidebar with navigation
- Top bar with user info
- Main content area with statistics cards

**Categories Page:**
- Tree view on left (60% width)
- Form/details on right (40% width)
- Expandable tree items with icons

**Products Page:**
- Grid layout (3-4 columns on desktop)
- Each card shows image placeholder, name, price, categories
- Hover effects on cards

---

## Final Deliverables

1. Fully functional React application
2. All CRUD operations working for Categories and Products
3. User authentication (login/register/logout)
4. Responsive design (mobile, tablet, desktop)
5. Error handling and loading states
6. Clean, maintainable code with comments
7. README with setup instructions

---

## Support & Resources

- **Backend API Documentation:** See `API_EXAMPLES.md` in the backend project
- **Backend URL:** `http://localhost:3000`
- **Test User:** Create via `/auth/register` endpoint

---

Good luck building the frontend! Focus on creating a clean, intuitive interface that makes managing hierarchical categories and multi-category products easy and enjoyable.
