import { ProductRepository } from '../repositories/products';
import { Product } from '../types/product';

/**
 * ProductService class for managing product operations.
 */
export class ProductService {
  private productRepository = new ProductRepository();

  /**
   * Retrieves all products from the repository.
   *
   * @returns {Promise<Product[]>} A promise that resolves to an array of products.
   */
  async getAllProducts(): Promise<Product[]> {
    const products = this.productRepository.getAll();
    return products;
  }

  /**
   * Retrieves a product by its ID.
   *
   * @param {string} id - The ID of the product to retrieve.
   * @returns {Promise<Product>} A promise that resolves to the found product.
   */
  async getProductById(id: string): Promise<Product> {
    const product = await this.productRepository.findById(id);
    return product;
  }

  /**
   * Updates the inventory count for a specified product by ID.
   *
   * @param {string} id - The ID of the product to update.
   * @param {number} quantity - The new inventory count for the product.
   * @returns {Promise<void>} A promise that resolves when the update is complete.
   */
  async updateProductById(id: string, quantity: number): Promise<void> {
    try {
      await this.productRepository.updateInventory(id, quantity);
    } catch (error: any) {
      throw error;
    }
  }

  /**
   * Places an order for a specified product by decrementing its inventory.
   *
   * @param {string} id - The ID of the product to order.
   * @param {number} quantity - The quantity to order.
   * @returns {Promise<void>} A promise that resolves when the order is placed.
   */
  async placeOrder(id: string, quantity: number): Promise<void> {
    try {
      await this.productRepository.decrementInventory(id, quantity);
    } catch (error: any) {
      throw error;
    }
  }
}
