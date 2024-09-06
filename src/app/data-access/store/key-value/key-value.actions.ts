import { createAction, props } from '@ngrx/store';

export const setKeyValue = createAction(
  '[KeyValue] Set Key Value',
  props<{ key: string; value: any }>()
);

export const removeKeyValue = createAction(
  '[KeyValue] Remove Key Value',
  props<{ key: string }>()
);
