import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { products } from './schema';
import { faker } from '@faker-js/faker';
import * as dotenv from 'dotenv';
import { logger } from '../utils/logger';

dotenv.config();

/**
 * Database Seeding Script
 *
 * This script seeds the 'products' table in the PostgreSQL database with
 * randomly generated product data using the Faker library. It establishes a
 * connection to the database, generates sample product data, and inserts it
 * into the products table.
 *
 * Features:
 * - Validates that the `DATABASE_URL` environment variable is set.
 * - Connects to the PostgreSQL database using a connection pool.
 * - Generates 20 product entries with unique IDs, product names, and inventory counts.
 * - Logs the start and completion of the seeding process.
 *
 * Usage:
 * - This script should be executed in an environment where the `DATABASE_URL`
 *   is correctly set up in the `.env.development` file.
 * - Ensure that the 'products' table is created in the database before running this script.
 */
if (!('DATABASE_URL' in process.env))
  throw new Error('DATABASE_URL not found on .env.development');

const main = async () => {
  const client = new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 10,
    idleTimeoutMillis: 30000,
  });
  const db = drizzle(client);
  const data: (typeof products.$inferInsert)[] = [];

  for (let i = 0; i < 10; i++) {
    data.push({
      id: faker.string.uuid(),
      name: faker.commerce.product(),
      inventoryCount: faker.number.int({ min: 5, max: 50 }),
    });
  }

  logger.info('Seed started!');
  await db.insert(products).values(data);
  logger.info('Seed finished!');
};

main();
