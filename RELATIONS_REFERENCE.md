# Quick Reference: Category & Product Relations

This document provides the exact code snippets for the self-referencing category relations and product many-to-many relations.

---

## Category Entity - Self-Referencing Relations

**File:** `src/categories/entities/category.entity.ts`

```typescript
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, OneToMany, ManyToMany, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Product } from '../../products/entities/product.entity';

@Entity('categories')
export class Category {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    user_id: number;

    @Column({ nullable: true })
    parent_id: number;

    @ManyToOne(() => User, (user) => user.categories, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User;

    // Self-referencing: Parent relation
    @ManyToOne(() => Category, (category) => category.children, { nullable: true, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'parent_id' })
    parent: Category;

    // Self-referencing: Children relation
    @OneToMany(() => Category, (category) => category.parent)
    children: Category[];

    // ManyToMany with products (inverse side)
    @ManyToMany(() => Product, (product) => product.categories)
    products: Product[];

    @CreateDateColumn()
    created_at: Date;
}
```

---

## Product Entity - ManyToMany with Categories

**File:** `src/products/entities/product.entity.ts`

```typescript
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, ManyToMany, JoinColumn, JoinTable } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Category } from '../../categories/entities/category.entity';

@Entity('products')
export class Product {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column('decimal')
    price: number;

    @Column()
    description: string;

    @Column()
    user_id: number;

    @ManyToOne(() => User, (user) => user.products, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User;

    // ManyToMany with categories (owning side with JoinTable)
    @ManyToMany(() => Category, (category) => category.products, { cascade: true })
    @JoinTable({
        name: 'product_categories',
        joinColumn: { name: 'product_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'category_id', referencedColumnName: 'id' },
    })
    categories: Category[];

    @CreateDateColumn()
    created_at: Date;
}
```

---

## Key Points

### Self-Referencing Category Relations

1. **Parent Relation (ManyToOne):**
   - A category can have **one** parent category
   - Uses `parent_id` column
   - `nullable: true` - root categories have no parent
   - `onDelete: 'CASCADE'` - deleting parent deletes children

2. **Children Relation (OneToMany):**
   - A category can have **many** child categories
   - Inverse side of the parent relation
   - No separate column needed (uses parent_id)

---

### Product-Category ManyToMany

1. **Owning Side (Product):**
   - Uses `@JoinTable` decorator
   - Specifies join table name: `product_categories`
   - Defines column names: `product_id` and `category_id`
   - `cascade: true` - saving product saves category relations

2. **Inverse Side (Category):**
   - Uses `@ManyToMany` without `@JoinTable`
   - References the owning side: `product.categories`

---

## Example Usage

### Create Category with Parent

```typescript
// Create root category
const electronics = await categoryRepo.save({
    name: 'Electronics',
    user_id: 1
});

// Create subcategory
const laptops = await categoryRepo.save({
    name: 'Laptops',
    user_id: 1,
    parent_id: electronics.id
});
```

---

### Create Product with Multiple Categories

```typescript
// Find categories
const categories = await categoryRepo.find({
    where: { id: In([2, 5]) }
});

// Create product
const product = await productRepo.save({
    name: 'Gaming Laptop',
    price: 1200,
    description: 'High-performance laptop',
    user_id: 1,
    categories: categories
});
```

---

### Query Category Tree

```typescript
// Get categories with children
const categories = await categoryRepo.find({
    relations: ['children', 'children.children']
});

// Filter root categories
const tree = categories.filter(cat => !cat.parent_id);
```

---

### Query Products with Categories

```typescript
// Get all products with their categories
const products = await productRepo.find({
    relations: ['categories']
});

// Result includes categories array
// {
//   id: 1,
//   name: 'Gaming Laptop',
//   categories: [
//     { id: 2, name: 'Laptops' },
//     { id: 5, name: 'Gaming Laptops' }
//   ]
// }
```

---

## Database Tables

### categories
```sql
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR NOT NULL,
    user_id INTEGER NOT NULL,
    parent_id INTEGER NULL,  -- Self-reference
    created_at TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE CASCADE
);
```

### products
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

### product_categories (Join Table)
```sql
CREATE TABLE product_categories (
    product_id INTEGER NOT NULL,
    category_id INTEGER NOT NULL,
    PRIMARY KEY (product_id, category_id),
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);
```
