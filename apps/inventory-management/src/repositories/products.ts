import { db } from '../db';
import { products } from '../db/schema';
import { Product } from '../types/product';
import { eq } from 'drizzle-orm';
import { NotFoundError } from '../errors/NotFoundError';
import { BadRequestError } from '../errors/BadRequestError';
import { logger } from '../utils/logger';

/**
 * ProductRepository class for managing product data in the database.
 */
export class ProductRepository {
  /**
   * Retrieves all products from the database.
   *
   * @returns {Promise<Product[]>} A promise that resolves to an array of products.
   */
  async getAll(): Promise<Product[]> {
    logger.debug('Getting all products');
    const result = await db.select().from(products).orderBy(products.name);

    return result;
  }

  /**
   * Finds a product by its ID.
   *
   * @param {string} id - The ID of the product to find.
   * @returns {Promise<Product>} A promise that resolves to the found product.
   * @throws {NotFoundError} If the product with the specified ID does not exist.
   */
  async findById(id: string): Promise<Product> {
    logger.debug(`Finding product with id: ${id}`);
    const result = await db.select().from(products).where(eq(products.id, id));
    if (result.length === 0) {
      throw new NotFoundError('Product not found');
    }
    return result[0];
  }

  /**
   * Updates the inventory count for a specified product.
   *
   * @param {string} id - The ID of the product to update.
   * @param {number} quantity - The new inventory count for the product.
   * @returns {Promise<void>} A promise that resolves when the update is complete.
   * @throws {NotFoundError} If the product with the specified ID does not exist.
   */
  async updateInventory(id: string, quantity: number): Promise<void> {
    logger.debug(
      `Updating inventory for product id: ${id} to quantity: ${quantity}`
    );

    const product = await db.select().from(products).where(eq(products.id, id));

    if (product.length === 0) {
      throw new NotFoundError('Product not found');
    }

    await db
      .update(products)
      .set({ inventoryCount: quantity })
      .where(eq(products.id, id));
  }

  /**
   * Decrements the inventory count for a specified product.
   *
   * @param {string} id - The ID of the product to decrement.
   * @param {number} quantity - The quantity to decrement from the inventory.
   * @returns {Promise<void>} A promise that resolves when the decrement is complete.
   * @throws {NotFoundError} If the product with the specified ID does not exist.
   * @throws {BadRequestError} If the decrement quantity is negative or exceeds the current inventory.
   */
  async decrementInventory(id: string, quantity: number): Promise<void> {
    logger.debug(
      `Decrementing inventory for product id: ${id} by quantity: ${quantity}`
    );

    if (quantity <= 0) {
      throw new BadRequestError('Decrement quantity cannot be negative');
    }

    const product = await db.select().from(products).where(eq(products.id, id));

    if (product.length === 0) {
      throw new NotFoundError('Product not found');
    }

    const currentInventory = product[0].inventoryCount;

    if (currentInventory < quantity) {
      throw new BadRequestError('Insufficient inventory');
    }

    await db
      .update(products)
      .set({ inventoryCount: currentInventory - quantity })
      .where(eq(products.id, id));
  }
}
