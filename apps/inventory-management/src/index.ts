import express from 'express';
import dotenv from 'dotenv';
import productRoutes from './routes/products';
import { logger } from './utils/logger';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './docs/swagger';

dotenv.config();

const app = express();
app.use(express.json());

app.use('/api/products', productRoutes);

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
  logger.info(`Swagger UI available at http://localhost:${PORT}/api-docs`);
});
