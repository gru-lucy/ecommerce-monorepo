import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import dotenv from 'dotenv';
import { logger } from '../utils/logger';

dotenv.config();

/**
 * Database Connection Module
 *
 * This module establishes a connection to a PostgreSQL database using the `pg` package
 * and integrates with `drizzle-orm` for ORM functionality. It uses environment variables
 * for configuration and includes error handling for idle connections.
 *
 * Features:
 * - Configures a PostgreSQL connection pool using the connection string from environment variables.
 * - Sets the pool to allow up to 10 concurrent connections and defines an idle timeout of 30 seconds.
 * - Logs any unexpected errors that occur on idle clients and gracefully exits the process.
 * - Exports the database connection wrapped with `drizzle-orm` for use in application queries and operations.
 *
 * Dependencies:
 * - dotenv: Loads environment variables from a `.env` file.
 * - pg (Pool): Manages the PostgreSQL connection pool.
 * - drizzle-orm: ORM for interacting with the PostgreSQL database.
 * - logger: Utility to log database errors.
 *
 * Usage:
 * - Import the `db` object in your service or repository layers to execute database queries.
 */

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 10,
  idleTimeoutMillis: 30000,
});

pool.on('error', (err) => {
  logger.error('Unexpected error on idle client', err);
  process.exit(-1);
});

export const db = drizzle(pool);
