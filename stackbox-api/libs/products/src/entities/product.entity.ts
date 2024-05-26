import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity } from 'typeorm';
import { ApiSchema } from '../../../common/src';
import { EntityBase } from '../../../database/src';
import { IProductEntity } from '../models/products.models';

@Entity('products')
@ApiSchema({ name: 'Product' })
export class ProductEntity extends EntityBase implements IProductEntity {
  @Column({ type: 'varchar', length: 100, unique: true })
  @ApiProperty()
  name: string;

  @Column({ type: 'varchar', length: 255 })
  @ApiProperty()
  description: string;
}
