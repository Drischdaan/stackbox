import { computed, inject } from '@angular/core';
import { tapResponse } from '@ngrx/operators';
import {
  patchState,
  signalStore,
  type,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import {
  addEntity,
  removeEntity,
  setAllEntities,
  updateEntity,
  withEntities,
} from '@ngrx/signals/entities';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import {
  Product,
  ProductCreateDto,
  ProductUpdateDto,
  ProductsService,
} from '@stackbox/shared/api-stackbox';
import { map, pipe, switchMap, tap } from 'rxjs';

export interface IProductsState {
  loadingList: boolean;
  loadingById: boolean;
  loadingCreate: boolean;
  loadingUpdate: boolean;
  loadingDelete: boolean;
  selectedProductId: string | null;
}

const initialState: IProductsState = {
  loadingList: false,
  loadingById: false,
  loadingCreate: false,
  loadingUpdate: false,
  loadingDelete: false,
  selectedProductId: null,
};

export const ProductsStore = signalStore(
  { providedIn: 'root' },
  withState<IProductsState>(initialState),
  withEntities<Product>({ entity: type<Product>() }),
  withComputed((state) => ({
    selectedProduct: computed(() => {
      const id: string | null = state.selectedProductId();
      return id ? state.entityMap()[id] : null;
    }),
  })),
  withMethods(
    (state, productsService: ProductsService = inject(ProductsService)) => ({
      loadList: rxMethod<{ limit?: number; page?: number }>(
        pipe(
          tap(() => patchState(state, { loadingList: true })),
          switchMap(({ limit, page }) =>
            productsService.getProductsPaginated(limit, page).pipe(
              map((paginatedProducts) => paginatedProducts.items),
              tapResponse({
                next: (products) => patchState(state, setAllEntities(products)),
                error: console.error,
                finalize: () => patchState(state, { loadingList: false }),
              })
            )
          )
        )
      ),
      loadById: rxMethod<string>(
        pipe(
          tap(() => patchState(state, { loadingById: true })),
          switchMap((id) =>
            productsService.getProductById(id).pipe(
              tapResponse({
                next: (product) => patchState(state, addEntity(product)),
                error: console.error,
                finalize: () => patchState(state, { loadingById: false }),
              })
            )
          )
        )
      ),
      create: rxMethod<ProductCreateDto>(
        pipe(
          tap(() => patchState(state, { loadingCreate: true })),
          switchMap((productDto) =>
            productsService.createProduct(productDto).pipe(
              tapResponse({
                next: (product) => patchState(state, addEntity(product)),
                error: console.error,
                finalize: () => patchState(state, { loadingCreate: false }),
              })
            )
          )
        )
      ),
      update: rxMethod<{ id: string; updateDto: ProductUpdateDto }>(
        pipe(
          tap(() => patchState(state, { loadingUpdate: true })),
          switchMap(({ id, updateDto }) =>
            productsService.updateProduct(id, updateDto).pipe(
              tapResponse({
                next: (product) =>
                  patchState(
                    state,
                    updateEntity({ id: product.id, changes: product })
                  ),
                error: console.error,
                finalize: () => patchState(state, { loadingUpdate: false }),
              })
            )
          )
        )
      ),
      delete: rxMethod<string>(
        pipe(
          tap(() => patchState(state, { loadingDelete: true })),
          switchMap((id) =>
            productsService.deleteProduct(id).pipe(
              tapResponse({
                next: () => patchState(state, removeEntity(id)),
                error: console.error,
                finalize: () => patchState(state, { loadingDelete: false }),
              })
            )
          )
        )
      ),
      selectProduct: (id: string) =>
        patchState(state, { selectedProductId: id }),
      unselectProduct: () => patchState(state, { selectedProductId: null }),
    })
  )
);
