import { Request, Response } from 'express';
import { ProductService } from '../services/products';
import { NotFoundError } from '../errors/NotFoundError';
import { BadRequestError } from '../errors/BadRequestError';
import { OrderDto } from '../validators/products';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { logger } from '../utils/logger';

export class ProductController {
  private productService: ProductService;

  constructor() {
    this.productService = new ProductService();
  }

  /**
   * Get all products
   *
   * Fetches and returns all available products from the product service.
   *
   * @param {Request} req - Express request object
   * @param {Response} res - Express response object
   * @returns {Promise<void>} - Returns a JSON response with the list of products or an error message
   */
  getAllProducts = async (req: Request, res: Response): Promise<void> => {
    try {
      const products = await this.productService.getAllProducts();
      res.json(products);
    } catch (error: any) {
      logger.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  /**
   * Get product by ID
   *
   * Fetches a specific product by its ID. Returns a 404 error if the product is not found.
   *
   * @param {Request} req - Express request object, expected to contain a product ID in the params
   * @param {Response} res - Express response object
   * @returns {Promise<void>} - Returns a JSON response with the product data or an error message
   */
  getProduct = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const product = await this.productService.getProductById(id);
      res.json(product);
    } catch (error: any) {
      if (error instanceof NotFoundError) {
        res.status(404).json({ message: error.message });
      } else {
        logger.error(error);
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  };

  /**
   * Update product inventory
   *
   * Updates the inventory of a product by its ID. Validates the request body using `OrderDto`.
   * Returns a 400 error for validation failures.
   *
   * @param {Request} req - Express request object, expected to contain a product ID in the params and quantity in the body
   * @param {Response} res - Express response object
   * @returns {Promise<void>} - Returns a success message or a validation/error message
   */
  updateProductInventory = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { id } = req.params;
      const orderDto = plainToInstance(OrderDto, {
        ...req.params,
        ...req.body,
      });
      const errors = await validate(orderDto);

      if (errors.length > 0) {
        res.status(400).json({ message: 'Validation failed', errors });
        return;
      }

      await this.productService.updateProductById(id, orderDto.quantity);
      res.json({ message: 'Product inventory updated successfully' });
    } catch (error: any) {
      logger.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  /**
   * Place an order
   *
   * Places an order for a product by its ID. Validates the request body using `OrderDto`.
   * Returns a 404 error if the product is not found or a 400 error for validation issues.
   *
   * @param {Request} req - Express request object, expected to contain a product ID in the params and quantity in the body
   * @param {Response} res - Express response object
   * @returns {Promise<void>} - Returns a success message or an error message depending on the request's validity
   */
  placeOrder = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const orderDto = plainToInstance(OrderDto, {
        ...req.params,
        ...req.body,
      });
      const errors = await validate(orderDto);

      if (errors.length > 0) {
        res.status(400).json({ message: 'Validation failed', errors });
        return;
      }

      await this.productService.placeOrder(id, orderDto.quantity);
      res.json({ message: 'Order placed successfully' });
    } catch (error: any) {
      if (error instanceof NotFoundError) {
        res.status(404).json({ message: error.message });
      } else if (error instanceof BadRequestError) {
        res.status(400).json({ message: error.message });
      } else {
        logger.error(error);
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  };
}
