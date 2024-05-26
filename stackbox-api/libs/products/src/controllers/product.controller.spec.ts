import { TestBed } from '@automock/jest';
import {
  DEFAULT_PAGINATION_LIMIT,
  DEFAULT_PAGINATION_PAGE,
  DeleteResponse,
  PaginationDto,
} from '../../../common/src/models/common.models';
import { ProductEntity } from '../entities/product.entity';
import { ProductService } from '../services/product.service';
import { ProductController } from './product.controller';

describe('ProductController', () => {
  let controller: ProductController;
  let productService: jest.Mocked<ProductService>;

  beforeEach(async () => {
    const { unit, unitRef } = TestBed.create(ProductController).compile();

    controller = unit;
    productService = unitRef.get<ProductService>(ProductService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return a list of products', async () => {
    const products: PaginationDto<ProductEntity> = {
      items: [
        {
          id: '1',
          createdAt: new Date(),
          updatedAt: new Date(),
          name: 'Product 1',
          description: 'This is a real product',
        },
      ],
      limit: DEFAULT_PAGINATION_LIMIT,
      page: DEFAULT_PAGINATION_PAGE,
      total: 1,
    };
    productService.getPaginatedList.mockResolvedValue(products);

    expect(await controller.getProductsPaginated()).toBe(products);
    expect(productService.getPaginatedList).toHaveBeenCalled();
  });

  describe('getProduct', () => {
    it('should return a product by id', async () => {
      const product: ProductEntity = {
        id: '1',
        createdAt: new Date(),
        updatedAt: new Date(),
        name: 'Product 1',
        description: 'This is a real product',
      };
      productService.getById.mockResolvedValue(product);

      expect(await controller.getProductById('1')).toBe(product);
      expect(productService.getById).toHaveBeenCalledWith('1');
    });

    it('should throw an error if product not found', async () => {
      productService.getById.mockResolvedValue(null);

      await expect(controller.getProductById('1')).rejects.toThrow();
      expect(productService.getById).toHaveBeenCalledWith('1');
    });
  });

  describe('createProduct', () => {
    it('should create a product', async () => {
      const product: ProductEntity = {
        id: '1',
        createdAt: new Date(),
        updatedAt: new Date(),
        name: 'Product 1',
        description: 'This is a real product',
      };
      productService.create.mockResolvedValue(product);

      expect(await controller.createProduct(product)).toBe(product);
      expect(productService.create).toHaveBeenCalledWith(product);
    });

    it('should throw an error if product is invalid', async () => {
      const product: ProductEntity = {
        id: '1',
        createdAt: new Date(),
        updatedAt: new Date(),
        name: 'Product 1',
        description: 'This is a real product',
      };
      productService.create.mockResolvedValue(null);

      await expect(controller.createProduct(product)).rejects.toThrow();
      expect(productService.create).toHaveBeenCalledWith(product);
    });
  });

  describe('updateProduct', () => {
    it('should update a product', async () => {
      const product: ProductEntity = {
        id: '1',
        createdAt: new Date(),
        updatedAt: new Date(),
        name: 'Product 1',
        description: 'This is a real product',
      };
      productService.update.mockResolvedValue(product);

      expect(await controller.updateProduct('1', product)).toBe(product);
      expect(productService.update).toHaveBeenCalledWith('1', product);
    });

    it('should throw an error if product is invalid', async () => {
      const product: ProductEntity = {
        id: '1',
        createdAt: new Date(),
        updatedAt: new Date(),
        name: 'Product 1',
        description: 'This is a real product',
      };
      productService.update.mockResolvedValue(null);

      await expect(controller.updateProduct('1', product)).rejects.toThrow();
      expect(productService.update).toHaveBeenCalledWith('1', product);
    });
  });

  describe('deleteProduct', () => {
    it('should delete a product', async () => {
      const expected: DeleteResponse = { id: '1' };
      productService.delete.mockResolvedValue(true);

      expect(await controller.deleteProduct('1')).toEqual(expected);
      expect(productService.delete).toHaveBeenCalledWith('1');
    });

    it('should throw an error if product is invalid', async () => {
      productService.delete.mockResolvedValue(false);

      await expect(controller.deleteProduct('1')).rejects.toThrow();
      expect(productService.delete).toHaveBeenCalledWith('1');
    });
  });
});
