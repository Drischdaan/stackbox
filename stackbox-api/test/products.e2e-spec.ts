import { INestApplication } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as request from 'supertest';
import { Repository } from 'typeorm';
import {
  DEFAULT_PAGINATION_LIMIT,
  DEFAULT_PAGINATION_PAGE,
  DeleteResponse,
  PaginationDto,
} from '../libs/common/src/models/common.models';
import { ProductCreateDto, ProductEntity } from '../libs/products/src';
import { AppModule } from './../src/app.module';
import { e2eDatabaseConfig } from './setup.e2e';

describe('ProductsController (e2e)', () => {
  let app: INestApplication;
  let repository: Repository<ProductEntity>;
  let products: ProductEntity[];

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        AppModule,
        ConfigModule.forRoot({
          isGlobal: true,
          load: [e2eDatabaseConfig],
        }),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    repository = app.get(getRepositoryToken(ProductEntity) as string);
    products = [];
    products.push(
      await repository.save(
        repository.create({ name: 'Test', description: 'This is a test' }),
      ),
    );
  });

  afterEach(async () => {
    await repository.createQueryBuilder().delete().execute();
    await app.close();
  });

  it('/products (GET)', () => {
    const expected: PaginationDto<ProductEntity> = {
      total: products.length,
      limit: DEFAULT_PAGINATION_LIMIT,
      page: DEFAULT_PAGINATION_PAGE,
      items: products,
    };
    return request(app.getHttpServer())
      .get('/products')
      .expect(200)
      .expect((response) => {
        expect(response.body.total).toBe(expected.total);
        expect(response.body.limit).toBe(expected.limit);
        expect(response.body.page).toBe(expected.page);
        expect(response.body.items[0].id).toBe(expected.items[0].id);
        expect(response.body.items[0].createdAt).toBe(
          expected.items[0].createdAt.toISOString(),
        );
        expect(response.body.items[0].updatedAt).toBe(
          expected.items[0].updatedAt.toISOString(),
        );
        expect(response.body.items[0].name).toBe(expected.items[0].name);
        expect(response.body.items[0].description).toBe(
          expected.items[0].description,
        );
      });
  });

  it('/products/:id (GET)', () => {
    return request(app.getHttpServer())
      .get(`/products/${products[0].id}`)
      .expect(200)
      .expect((response) => {
        expect(response.body.id).toBe(products[0].id);
        expect(response.body.createdAt).toBe(
          products[0].createdAt.toISOString(),
        );
        expect(response.body.updatedAt).toBe(
          products[0].updatedAt.toISOString(),
        );
        expect(response.body.name).toBe(products[0].name);
        expect(response.body.description).toBe(products[0].description);
      });
  });

  it('/products (POST)', () => {
    const newProduct: ProductCreateDto = {
      name: 'Test 2',
      description: 'This is another test',
    };
    return request(app.getHttpServer())
      .post('/products')
      .send(newProduct)
      .expect(201)
      .expect((response) => {
        expect(response.body.id).toBeDefined();
        expect(response.body.createdAt).toBeDefined();
        expect(response.body.updatedAt).toBeDefined();
        expect(response.body.name).toBe(newProduct.name);
        expect(response.body.description).toBe(newProduct.description);
      });
  });

  it('/products/:id (PATCH)', () => {
    const updatedProduct: ProductEntity = {
      ...products[0],
      name: 'Updated',
      description: 'This is an updated test',
    };
    return request(app.getHttpServer())
      .patch(`/products/${products[0].id}`)
      .send(updatedProduct)
      .expect(200)
      .expect((response) => {
        expect(response.body.id).toBe(updatedProduct.id);
        expect(response.body.createdAt).toBe(
          updatedProduct.createdAt.toISOString(),
        );
        expect(response.body.updatedAt).not.toBe(
          updatedProduct.updatedAt.toISOString(),
        );
        expect(response.body.name).toBe(updatedProduct.name);
        expect(response.body.description).toBe(updatedProduct.description);
      });
  });

  it('/products/:id (DELETE)', () => {
    const expected: DeleteResponse = { id: products[0].id };
    return request(app.getHttpServer())
      .delete(`/products/${products[0].id}`)
      .expect(200)
      .expect({
        id: expected.id,
      });
  });
});
