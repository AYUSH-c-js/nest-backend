-- Migration: Add subcategory support and multiple categories per product
-- Description: This migration adds self-referencing relations to categories and converts products to use many-to-many relation

-- Step 1: Add parent_id column to categories table
ALTER TABLE categories 
ADD COLUMN parent_id INTEGER NULL;

-- Step 2: Add foreign key constraint for parent_id
ALTER TABLE categories 
ADD CONSTRAINT fk_category_parent 
FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE CASCADE;

-- Step 3: Create product_categories join table
CREATE TABLE product_categories (
    product_id INTEGER NOT NULL,
    category_id INTEGER NOT NULL,
    PRIMARY KEY (product_id, category_id),
    CONSTRAINT fk_product_categories_product 
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    CONSTRAINT fk_product_categories_category 
        FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);

-- Step 4: Migrate existing product-category relationships to join table
-- This preserves existing data before removing the old column
INSERT INTO product_categories (product_id, category_id)
SELECT id, category_id FROM products WHERE category_id IS NOT NULL;

-- Step 5: Remove old category_id foreign key constraint
ALTER TABLE products DROP CONSTRAINT IF EXISTS products_category_id_fkey;

-- Step 6: Remove old category_id column from products table
ALTER TABLE products DROP COLUMN category_id;

-- Verification queries:
-- Check categories with parent-child relationships
-- SELECT c1.id, c1.name, c1.parent_id, c2.name as parent_name 
-- FROM categories c1 
-- LEFT JOIN categories c2 ON c1.parent_id = c2.id;

-- Check products with their categories
-- SELECT p.id, p.name, array_agg(c.name) as categories 
-- FROM products p 
-- LEFT JOIN product_categories pc ON p.id = pc.product_id 
-- LEFT JOIN categories c ON pc.category_id = c.id 
-- GROUP BY p.id, p.name;
