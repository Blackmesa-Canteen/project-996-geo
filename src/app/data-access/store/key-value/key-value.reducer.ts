import { createReducer, on } from '@ngrx/store';
import { setKeyValue, removeKeyValue } from './key-value.actions';

export interface KeyValueState {
  [key: string]: any;
}

export const initialState: KeyValueState = {};

const _keyValueReducer = createReducer(
  initialState,
  on(setKeyValue, (state, { key, value }) => ({ ...state, [key]: value })),
  on(removeKeyValue, (state, { key }) => {
    const newState = { ...state };
    delete newState[key];
    return newState;
  })
);

export function keyValueReducer(state: any, action: any) {
  return _keyValueReducer(state, action);
}
