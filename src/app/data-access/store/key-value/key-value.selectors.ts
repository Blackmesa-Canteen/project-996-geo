import { createFeatureSelector, createSelector } from '@ngrx/store';
import { KeyValueState } from './key-value.reducer';

export const selectKeyValueState = createFeatureSelector<KeyValueState>('keyValue');

export const selectValueByKey = (key: string) =>
  createSelector(selectKeyValueState, (state: KeyValueState) => state[key]);
