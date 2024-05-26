import { computed } from '@angular/core';
import {
  patchState,
  signalStoreFeature,
  type,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { EntityId, EntityState } from '@ngrx/signals/entities';

export interface ISelectedEntityState {
  selectedEntityId: EntityId | null;
}

const initialState: ISelectedEntityState = {
  selectedEntityId: null,
};

export function withSelectedEntity<TEntity>() {
  return signalStoreFeature(
    { state: type<EntityState<TEntity>>() },
    withState<ISelectedEntityState>(initialState),
    withComputed((state) => ({
      selectedEntity: computed(() => {
        const id: EntityId | null = state.selectedEntityId();
        return id ? state.entityMap()[id] : null;
      }),
    })),
    withMethods((state) => ({
      select: (id: EntityId) => patchState(state, { selectedEntityId: id }),
      unselect: () => patchState(state, { selectedEntityId: null }),
    }))
  );
}
