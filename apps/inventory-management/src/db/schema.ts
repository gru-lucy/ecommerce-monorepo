import { pgTable, varchar, uuid, integer } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

/**
 * Products Table Schema
 *
 * This module defines the schema for the 'products' table using Drizzle ORM.
 * It specifies the structure of the table, including the columns and their data types,
 * constraints, and default values.
 *
 * Table Structure:
 * - id (UUID): A unique identifier for each product, automatically generated using `gen_random_uuid()`.
 * - name (VARCHAR): The name of the product, with a maximum length of 255 characters. This field is required.
 * - inventoryCount (INTEGER): The count of products in inventory. This field is required and defaults to 0.
 *
 * Usage:
 * - This schema can be imported and used to interact with the 'products' table
 *   in the PostgreSQL database using Drizzle ORM.
 */

export const products = pgTable('products', {
  id: uuid('id')
    .default(sql`gen_random_uuid()`)
    .primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  inventoryCount: integer('inventory_count').notNull().default(0),
});
