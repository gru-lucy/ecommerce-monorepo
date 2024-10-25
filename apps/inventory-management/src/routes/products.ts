import { Router } from 'express';
import { ProductController } from '../controllers/products';

const router = Router();

const productController = new ProductController();

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get all products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Product found
 *       404:
 *         description: Product not found
 */
router.get('/', productController.getAllProducts);

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Get product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product found
 *       404:
 *         description: Product not found
 */
router.get('/:id', productController.getProduct);

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Update inventory count of a product
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     requestBody:
 *       description: Product details
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - quantity
 *             properties:
 *               quantity:
 *                 type: integer
 *                 minimum: 1
 *     responses:
 *       200:
 *         description: Product inventory updated successfully
 *       400:
 *         description: Validation failed or insufficient inventory
 *       404:
 *         description: Product not found
 */
router.put('/:id', productController.updateProductInventory);

/**
 * @swagger
 * /api/products/{id}/order:
 *   post:
 *     summary: Place an order
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     requestBody:
 *       description: Order details
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - quantity
 *             properties:
 *               quantity:
 *                 type: integer
 *                 minimum: 1
 *     responses:
 *       200:
 *         description: Order placed successfully
 *       400:
 *         description: Validation failed or insufficient inventory
 *       404:
 *         description: Product not found
 */
router.post('/:id/order', productController.placeOrder);

export default router;
