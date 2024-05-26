import { signalStore, type, withState } from '@ngrx/signals';
import { withEntities } from '@ngrx/signals/entities';
import {
  Product,
  ProductCreateDto,
  ProductUpdateDto,
} from '@stackbox/shared/api-stackbox';
import {
  withDataSource,
  withSelectedEntity,
} from '@stackbox/shared/utils-store';
import { ProductsDataSource } from './products.data-source';

export interface IProductsState {
  test: boolean;
}

const initialState: IProductsState = {
  test: false,
};

export const ProductsStore = signalStore(
  { providedIn: 'root' },
  withState<IProductsState>(initialState),
  withEntities<Product>({ entity: type<Product>() }),
  withSelectedEntity<Product>(),
  withDataSource<Product, ProductCreateDto, ProductUpdateDto>(
    ProductsDataSource
  )
);
