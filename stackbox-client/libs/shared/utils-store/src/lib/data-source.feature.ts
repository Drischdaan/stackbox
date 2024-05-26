import { ProviderToken, inject } from '@angular/core';
import { tapResponse } from '@ngrx/operators';
import {
  patchState,
  signalStoreFeature,
  type,
  withMethods,
  withState,
} from '@ngrx/signals';
import {
  EntityId,
  EntityState,
  addEntity,
  removeEntity,
  setEntities,
  updateEntity,
} from '@ngrx/signals/entities';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { DeleteResponse } from '@stackbox/shared/api-stackbox';
import { Observable, pipe, switchMap, tap } from 'rxjs';

export interface IDataSource<
  TEntity,
  TCreateDto extends Partial<TEntity>,
  TUpdateDto extends Partial<TEntity>
> {
  getPaginatedList(options?: {
    limit?: number;
    page?: number;
  }): Observable<TEntity[]>;
  getById(id: string): Observable<TEntity>;
  create(createDto: TCreateDto): Observable<TEntity>;
  update(id: string, updateDto: TUpdateDto): Observable<TEntity>;
  delete(id: string): Observable<DeleteResponse>;
}

export interface IDataSourceState {
  loadingList: boolean;
  loadingById: boolean;
  loadingCreate: boolean;
  loadingUpdate: boolean;
  loadingDelete: boolean;
}

const initialState: IDataSourceState = {
  loadingList: false,
  loadingById: false,
  loadingCreate: false,
  loadingUpdate: false,
  loadingDelete: false,
};

export function withDataSource<
  TEntity extends {
    id: EntityId;
  },
  TCreateDto extends Partial<TEntity>,
  TUpdateDto extends Partial<TEntity>
>(dataSourceType: ProviderToken<IDataSource<TEntity, TCreateDto, TUpdateDto>>) {
  return signalStoreFeature(
    { state: type<EntityState<TEntity>>() },
    withState<IDataSourceState>(initialState),
    withMethods((state) => {
      const dataSource: IDataSource<TEntity, TCreateDto, TUpdateDto> =
        inject(dataSourceType);
      return {
        loadList: rxMethod<{ limit?: number; page?: number }>(
          pipe(
            tap(() => patchState(state, { loadingList: true })),
            switchMap(({ limit, page }) =>
              dataSource.getPaginatedList({ limit, page }).pipe(
                tapResponse({
                  next: (entities) => patchState(state, setEntities(entities)),
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
              dataSource.getById(id).pipe(
                tapResponse({
                  next: (entity) => patchState(state, addEntity(entity)),
                  error: console.error,
                  finalize: () => patchState(state, { loadingById: false }),
                })
              )
            )
          )
        ),
        create: rxMethod<TCreateDto>(
          pipe(
            tap(() => patchState(state, { loadingCreate: true })),
            switchMap((createDto) =>
              dataSource.create(createDto).pipe(
                tapResponse({
                  next: (entity) => patchState(state, addEntity(entity)),
                  error: console.error,
                  finalize: () => patchState(state, { loadingCreate: false }),
                })
              )
            )
          )
        ),
        update: rxMethod<{ id: string; updateDto: TUpdateDto }>(
          pipe(
            tap(() => patchState(state, { loadingUpdate: true })),
            switchMap(({ id, updateDto }) =>
              dataSource.update(id, updateDto).pipe(
                tapResponse({
                  next: (entity) =>
                    patchState(
                      state,
                      updateEntity({ id: entity.id, changes: entity })
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
              dataSource.delete(id).pipe(
                tapResponse({
                  next: (response) =>
                    patchState(state, removeEntity(response.id)),
                  error: console.error,
                  finalize: () => patchState(state, { loadingDelete: false }),
                })
              )
            )
          )
        ),
      };
    })
  );
}
