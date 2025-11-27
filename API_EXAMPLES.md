# Category and Product Architecture Updates

This document provides examples and usage guide for the updated category and product architecture.

## Overview

The system now supports:
1. **Subcategories**: Categories can have parent-child relationships (self-referencing)
2. **Multiple Categories per Product**: Products can belong to multiple categories via ManyToMany relation

---

## Category API Examples

### 1. Create Root Category

**Request:**
```bash
POST /categories
Content-Type: application/json
Authorization: Bearer <your-jwt-token>

{
  "name": "Electronics"
}
```

**Response:**
```json
{
  "id": 1,
  "name": "Electronics",
  "user_id": 1,
  "parent_id": null,
  "created_at": "2025-11-26T10:30:00.000Z"
}
```

---

### 2. Create Subcategory

**Request:**
```bash
POST /categories
Content-Type: application/json
Authorization: Bearer <your-jwt-token>

{
  "name": "Laptops",
  "parent_id": 1
}
```

**Response:**
```json
{
  "id": 2,
  "name": "Laptops",
  "user_id": 1,
  "parent_id": 1,
  "created_at": "2025-11-26T10:31:00.000Z"
}
```

---

### 3. Create Nested Subcategory (3 levels deep)

**Request:**
```bash
POST /categories
Content-Type: application/json
Authorization: Bearer <your-jwt-token>

{
  "name": "Gaming Laptops",
  "parent_id": 2
}
```

**Response:**
```json
{
  "id": 5,
  "name": "Gaming Laptops",
  "user_id": 1,
  "parent_id": 2,
  "created_at": "2025-11-26T10:32:00.000Z"
}
```

---

### 4. Get All Categories (Flat List with Relations)

**Request:**
```bash
GET /categories
Authorization: Bearer <your-jwt-token>
```

**Response:**
```json
[
  {
    "id": 1,
    "name": "Electronics",
    "user_id": 1,
    "parent_id": null,
    "created_at": "2025-11-26T10:30:00.000Z",
    "parent": null,
    "children": [
      {
        "id": 2,
        "name": "Laptops",
        "user_id": 1,
        "parent_id": 1,
        "created_at": "2025-11-26T10:31:00.000Z"
      },
      {
        "id": 3,
        "name": "Smartphones",
        "user_id": 1,
        "parent_id": 1,
        "created_at": "2025-11-26T10:31:30.000Z"
      }
    ]
  },
  {
    "id": 2,
    "name": "Laptops",
    "user_id": 1,
    "parent_id": 1,
    "created_at": "2025-11-26T10:31:00.000Z",
    "parent": {
      "id": 1,
      "name": "Electronics"
    },
    "children": [
      {
        "id": 5,
        "name": "Gaming Laptops",
        "user_id": 1,
        "parent_id": 2,
        "created_at": "2025-11-26T10:32:00.000Z"
      }
    ]
  }
]
```

---

### 5. Get Category Tree (Hierarchical Structure)

**Request:**
```bash
GET /categories/tree
Authorization: Bearer <your-jwt-token>
```

**Response:**
```json
[
  {
    "id": 1,
    "name": "Electronics",
    "user_id": 1,
    "parent_id": null,
    "created_at": "2025-11-26T10:30:00.000Z",
    "children": [
      {
        "id": 2,
        "name": "Laptops",
        "user_id": 1,
        "parent_id": 1,
        "created_at": "2025-11-26T10:31:00.000Z",
        "children": [
          {
            "id": 5,
            "name": "Gaming Laptops",
            "user_id": 1,
            "parent_id": 2,
            "created_at": "2025-11-26T10:32:00.000Z",
            "children": []
          }
        ]
      },
      {
        "id": 3,
        "name": "Smartphones",
        "user_id": 1,
        "parent_id": 1,
        "created_at": "2025-11-26T10:31:30.000Z",
        "children": []
      }
    ]
  },
  {
    "id": 4,
    "name": "Clothing",
    "user_id": 1,
    "parent_id": null,
    "created_at": "2025-11-26T10:33:00.000Z",
    "children": []
  }
]
```

---

### 6. Update Category (Change Parent)

**Request:**
```bash
PATCH /categories/5
Content-Type: application/json
Authorization: Bearer <your-jwt-token>

{
  "parent_id": 1
}
```

**Response:**
```json
{
  "id": 5,
  "name": "Gaming Laptops",
  "user_id": 1,
  "parent_id": 1,
  "created_at": "2025-11-26T10:32:00.000Z"
}
```

---

### 7. Delete Category (Cascade Delete Children)

**Request:**
```bash
DELETE /categories/1
Authorization: Bearer <your-jwt-token>
```

**Response:**
```
Status: 200 OK
```

**Note:** Deleting category ID 1 will also delete all its subcategories (2, 3, 5) due to CASCADE delete.

---

## Product API Examples

### 1. Create Product with Multiple Categories

**Request:**
```bash
POST /products
Content-Type: application/json
Authorization: Bearer <your-jwt-token>

{
  "name": "Laptop",
  "price": 1200,
  "description": "High-performance gaming laptop with RTX 4080",
  "category_ids": [2, 5]
}
```

**Response:**
```json
{
  "id": 1,
  "name": "Laptop",
  "price": 1200,
  "description": "High-performance gaming laptop with RTX 4080",
  "user_id": 1,
  "created_at": "2025-11-26T10:35:00.000Z",
  "categories": [
    {
      "id": 2,
      "name": "Laptops",
      "user_id": 1,
      "parent_id": 1,
      "created_at": "2025-11-26T10:31:00.000Z"
    },
    {
      "id": 5,
      "name": "Gaming Laptops",
      "user_id": 1,
      "parent_id": 2,
      "created_at": "2025-11-26T10:32:00.000Z"
    }
  ]
}
```

---

### 2. Create Product with Single Category

**Request:**
```bash
POST /products
Content-Type: application/json
Authorization: Bearer <your-jwt-token>

{
  "name": "iPhone 15 Pro",
  "price": 999,
  "description": "Latest iPhone model",
  "category_ids": [3]
}
```

**Response:**
```json
{
  "id": 2,
  "name": "iPhone 15 Pro",
  "price": 999,
  "description": "Latest iPhone model",
  "user_id": 1,
  "created_at": "2025-11-26T10:36:00.000Z",
  "categories": [
    {
      "id": 3,
      "name": "Smartphones",
      "user_id": 1,
      "parent_id": 1,
      "created_at": "2025-11-26T10:31:30.000Z"
    }
  ]
}
```

---

### 3. Get All Products with Categories

**Request:**
```bash
GET /products
Authorization: Bearer <your-jwt-token>
```

**Response:**
```json
[
  {
    "id": 1,
    "name": "Laptop",
    "price": 1200,
    "description": "High-performance gaming laptop with RTX 4080",
    "user_id": 1,
    "created_at": "2025-11-26T10:35:00.000Z",
    "categories": [
      {
        "id": 2,
        "name": "Laptops",
        "user_id": 1,
        "parent_id": 1,
        "created_at": "2025-11-26T10:31:00.000Z"
      },
      {
        "id": 5,
        "name": "Gaming Laptops",
        "user_id": 1,
        "parent_id": 2,
        "created_at": "2025-11-26T10:32:00.000Z"
      }
    ]
  },
  {
    "id": 2,
    "name": "iPhone 15 Pro",
    "price": 999,
    "description": "Latest iPhone model",
    "user_id": 1,
    "created_at": "2025-11-26T10:36:00.000Z",
    "categories": [
      {
        "id": 3,
        "name": "Smartphones",
        "user_id": 1,
        "parent_id": 1,
        "created_at": "2025-11-26T10:31:30.000Z"
      }
    ]
  }
]
```

---

### 4. Update Product Categories

**Request:**
```bash
PATCH /products/1
Content-Type: application/json
Authorization: Bearer <your-jwt-token>

{
  "category_ids": [2, 3, 5]
}
```

**Response:**
```json
{
  "id": 1,
  "name": "Laptop",
  "price": 1200,
  "description": "High-performance gaming laptop with RTX 4080",
  "user_id": 1,
  "created_at": "2025-11-26T10:35:00.000Z",
  "categories": [
    {
      "id": 2,
      "name": "Laptops",
      "user_id": 1,
      "parent_id": 1,
      "created_at": "2025-11-26T10:31:00.000Z"
    },
    {
      "id": 3,
      "name": "Smartphones",
      "user_id": 1,
      "parent_id": 1,
      "created_at": "2025-11-26T10:31:30.000Z"
    },
    {
      "id": 5,
      "name": "Gaming Laptops",
      "user_id": 1,
      "parent_id": 2,
      "created_at": "2025-11-26T10:32:00.000Z"
    }
  ]
}
```

---

### 5. Update Product Name and Price (Keep Categories)

**Request:**
```bash
PATCH /products/1
Content-Type: application/json
Authorization: Bearer <your-jwt-token>

{
  "name": "Gaming Laptop Pro",
  "price": 1500
}
```

**Response:**
```json
{
  "id": 1,
  "name": "Gaming Laptop Pro",
  "price": 1500,
  "description": "High-performance gaming laptop with RTX 4080",
  "user_id": 1,
  "created_at": "2025-11-26T10:35:00.000Z",
  "categories": [
    {
      "id": 2,
      "name": "Laptops",
      "user_id": 1,
      "parent_id": 1,
      "created_at": "2025-11-26T10:31:00.000Z"
    },
    {
      "id": 5,
      "name": "Gaming Laptops",
      "user_id": 1,
      "parent_id": 2,
      "created_at": "2025-11-26T10:32:00.000Z"
    }
  ]
}
```

---

## TypeORM Query Examples

### Get Category Tree with Relations

```typescript
// In CategoriesService
async getCategoryTree(user: User): Promise<Category[]> {
    const categories = await this.categoriesRepository.find({
        where: { user: { id: user.id } },
        relations: ['children', 'children.children', 'children.children.children'],
    });

    // Filter only root categories (those without parent)
    return categories.filter(cat => !cat.parent_id);
}
```

---

### Get Products with All Categories

```typescript
// In ProductsService
async findAll(user: User): Promise<Product[]> {
    return this.productsRepository.find({
        where: { user: { id: user.id } },
        relations: ['categories'],
    });
}
```

---

### Get Single Product with Categories

```typescript
// In ProductsService
async findOne(id: number, user: User): Promise<Product> {
    const product = await this.productsRepository.findOne({
        where: { id, user: { id: user.id } },
        relations: ['categories'],
    });
    
    if (!product) {
        throw new NotFoundException(`Product with ID ${id} not found`);
    }
    
    return product;
}
```

---

### Validate Multiple Categories Exist

```typescript
// In ProductsService
import { In } from 'typeorm';

const categories = await this.categoriesRepository.find({
    where: {
        id: In(category_ids),
        user: { id: user.id }
    },
});

if (categories.length !== category_ids.length) {
    throw new NotFoundException('One or more categories not found');
}
```

---

## Database Schema

### Categories Table

```sql
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR NOT NULL,
    user_id INTEGER NOT NULL,
    parent_id INTEGER NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE CASCADE
);
```

---

### Products Table

```sql
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR NOT NULL,
    price DECIMAL NOT NULL,
    description VARCHAR NOT NULL,
    user_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

---

### Product Categories Join Table

```sql
CREATE TABLE product_categories (
    product_id INTEGER NOT NULL,
    category_id INTEGER NOT NULL,
    PRIMARY KEY (product_id, category_id),
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);
```

---

## Error Handling

### Invalid Parent Category

**Request:**
```json
{
  "name": "Test Category",
  "parent_id": 999
}
```

**Response:**
```json
{
  "statusCode": 404,
  "message": "Parent category not found or does not belong to user",
  "error": "Not Found"
}
```

---

### Circular Parent Reference

**Request:**
```json
{
  "parent_id": 5
}
```
(Trying to set category 1's parent to category 5, where 5 is a descendant of 1)

**Response:**
```json
{
  "statusCode": 400,
  "message": "Cannot create circular parent-child relationship",
  "error": "Bad Request"
}
```

---

### Invalid Category IDs in Product

**Request:**
```json
{
  "name": "Product",
  "price": 100,
  "description": "Test",
  "category_ids": [1, 999]
}
```

**Response:**
```json
{
  "statusCode": 404,
  "message": "One or more categories not found or do not belong to user",
  "error": "Not Found"
}
```

---

## Migration Steps

1. **Backup your database** before running migration
2. Run the migration SQL file: `migrations/add-subcategories-and-multiple-categories.sql`
3. Verify data migration with the verification queries in the SQL file
4. Restart your NestJS application
5. Test the new endpoints

---

## Notes

- **Cascade Delete**: Deleting a parent category will automatically delete all its subcategories
- **Cascade Delete**: Deleting a product will automatically remove entries from `product_categories` join table
- **Validation**: The system prevents circular parent-child relationships
- **Validation**: All categories must belong to the authenticated user
- **Multiple Levels**: You can create unlimited levels of subcategories (though the tree endpoint loads 3 levels deep for performance)
