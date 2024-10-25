import { ProductRepository } from '../products';
import { db } from '../../db';
import { products } from '../../db/schema';
import { NotFoundError } from '../../errors/NotFoundError';
import { BadRequestError } from '../../errors/BadRequestError';
import { eq } from 'drizzle-orm';

jest.mock('../../db', () => ({
  db: {
    select: jest.fn(),
    update: jest.fn(),
  },
}));

const dbMock = db as jest.Mocked<typeof db>;

describe('ProductRepository', () => {
  let productRepository: ProductRepository;

  beforeEach(() => {
    productRepository = new ProductRepository();
    jest.clearAllMocks();
  });

  describe('getAll', () => {
    it('should return all products', async () => {
      const mockProducts = [
        { id: '1', name: 'Product 1', inventoryCount: 10 },
        { id: '2', name: 'Product 2', inventoryCount: 20 },
      ];

      // Mock the chainable select().from() methods
      const selectFromMock = {
        from: jest.fn().mockResolvedValue(mockProducts),
      };
      (dbMock.select as jest.Mock).mockReturnValue(selectFromMock);

      const result = await productRepository.getAll();

      expect(result).toEqual(mockProducts);
      expect(dbMock.select).toHaveBeenCalled();
      expect(selectFromMock.from).toHaveBeenCalledWith(products);
    });
  });

  describe('findById', () => {
    it('should return the product when found', async () => {
      const id = '1';
      const mockProduct = { id: '1', name: 'Product 1', inventoryCount: 10 };

      // Mock the chainable select().from().where() methods
      const selectFromWhereMock = {
        from: jest.fn().mockReturnThis(),
        where: jest.fn().mockResolvedValue([mockProduct]),
      };
      (dbMock.select as jest.Mock).mockReturnValue(selectFromWhereMock);

      const result = await productRepository.findById(id);

      expect(result).toEqual(mockProduct);
      expect(dbMock.select).toHaveBeenCalled();
      expect(selectFromWhereMock.from).toHaveBeenCalledWith(products);
      expect(selectFromWhereMock.where).toHaveBeenCalledWith(
        eq(products.id, id)
      );
    });

    it('should throw NotFoundError when product is not found', async () => {
      const id = '1';

      const selectFromWhereMock = {
        from: jest.fn().mockReturnThis(),
        where: jest.fn().mockResolvedValue([]),
      };
      (dbMock.select as jest.Mock).mockReturnValue(selectFromWhereMock);

      await expect(productRepository.findById(id)).rejects.toThrow(
        NotFoundError
      );
    });
  });

  describe('updateInventory', () => {
    it('should update inventory when product is found', async () => {
      const id = '1';
      const quantity = 15;
      const mockProduct = { id: '1', name: 'Product 1', inventoryCount: 10 };

      // Mock the select().from().where() chain
      const selectFromWhereMock = {
        from: jest.fn().mockReturnThis(),
        where: jest.fn().mockResolvedValue([mockProduct]),
      };
      (dbMock.select as jest.Mock).mockReturnValue(selectFromWhereMock);

      // Mock the update().set().where() chain
      const updateSetWhereMock = {
        set: jest.fn().mockReturnThis(),
        where: jest.fn().mockResolvedValue(undefined),
      };
      (dbMock.update as jest.Mock).mockReturnValue(updateSetWhereMock);

      await productRepository.updateInventory(id, quantity);

      expect(dbMock.select).toHaveBeenCalled();
      expect(selectFromWhereMock.from).toHaveBeenCalledWith(products);
      expect(selectFromWhereMock.where).toHaveBeenCalledWith(
        eq(products.id, id)
      );

      expect(dbMock.update).toHaveBeenCalledWith(products);
      expect(updateSetWhereMock.set).toHaveBeenCalledWith({
        inventoryCount: quantity,
      });
      expect(updateSetWhereMock.where).toHaveBeenCalledWith(
        eq(products.id, id)
      );
    });

    it('should throw NotFoundError when product is not found', async () => {
      const id = '1';
      const quantity = 15;

      const selectFromWhereMock = {
        from: jest.fn().mockReturnThis(),
        where: jest.fn().mockResolvedValue([]),
      };
      (dbMock.select as jest.Mock).mockReturnValue(selectFromWhereMock);

      await expect(
        productRepository.updateInventory(id, quantity)
      ).rejects.toThrow(NotFoundError);
    });
  });

  describe('decrementInventory', () => {
    it('should decrement inventory when product is found and sufficient inventory', async () => {
      const id = '1';
      const quantity = 5;
      const mockProduct = { id: '1', name: 'Product 1', inventoryCount: 10 };

      const selectFromWhereMock = {
        from: jest.fn().mockReturnThis(),
        where: jest.fn().mockResolvedValue([mockProduct]),
      };
      (dbMock.select as jest.Mock).mockReturnValue(selectFromWhereMock);

      const updateSetWhereMock = {
        set: jest.fn().mockReturnThis(),
        where: jest.fn().mockResolvedValue(undefined),
      };
      (dbMock.update as jest.Mock).mockReturnValue(updateSetWhereMock);

      await productRepository.decrementInventory(id, quantity);

      expect(dbMock.select).toHaveBeenCalled();
      expect(selectFromWhereMock.from).toHaveBeenCalledWith(products);
      expect(selectFromWhereMock.where).toHaveBeenCalledWith(
        eq(products.id, id)
      );

      expect(dbMock.update).toHaveBeenCalledWith(products);
      expect(updateSetWhereMock.set).toHaveBeenCalledWith({
        inventoryCount: mockProduct.inventoryCount - quantity,
      });
      expect(updateSetWhereMock.where).toHaveBeenCalledWith(
        eq(products.id, id)
      );
    });

    it('should throw BadRequestError when decrement quantity is negative or zero', async () => {
      const id = '1';
      const quantity = -5;

      await expect(
        productRepository.decrementInventory(id, quantity)
      ).rejects.toThrow(BadRequestError);
    });

    it('should throw NotFoundError when product is not found', async () => {
      const id = '1';
      const quantity = 5;

      const selectFromWhereMock = {
        from: jest.fn().mockReturnThis(),
        where: jest.fn().mockResolvedValue([]),
      };
      (dbMock.select as jest.Mock).mockReturnValue(selectFromWhereMock);

      await expect(
        productRepository.decrementInventory(id, quantity)
      ).rejects.toThrow(NotFoundError);
    });

    it('should throw BadRequestError when insufficient inventory', async () => {
      const id = '1';
      const quantity = 15;
      const mockProduct = { id: '1', name: 'Product 1', inventoryCount: 10 };

      const selectFromWhereMock = {
        from: jest.fn().mockReturnThis(),
        where: jest.fn().mockResolvedValue([mockProduct]),
      };
      (dbMock.select as jest.Mock).mockReturnValue(selectFromWhereMock);

      await expect(
        productRepository.decrementInventory(id, quantity)
      ).rejects.toThrow(BadRequestError);
    });
  });
});
