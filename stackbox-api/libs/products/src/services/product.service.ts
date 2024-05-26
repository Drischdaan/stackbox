import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import {
  CrudService,
  RelationsMapping,
} from '../../../common/src/services/crud.service';
import { ProductEntity } from '../entities/product.entity';

@Injectable()
export class ProductService extends CrudService<ProductEntity> {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
    protected readonly entityManager: EntityManager,
  ) {
    super(productRepository, entityManager);
  }

  getUniqueConstraints(): (keyof ProductEntity)[] {
    return ['name'];
  }

  getRelationFields(): RelationsMapping<ProductEntity> {
    return {};
  }
}
