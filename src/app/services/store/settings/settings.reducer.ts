import { Action, createReducer, on } from '@ngrx/store';
import SettingsState, { initializeState } from './settings.state';
import * as SettingsActions from './settings.action';

const initialState = initializeState();

const reducer = createReducer(
  initialState,

  on(SettingsActions.SuccessLoadSettingsAction, (state: SettingsState, { payload }) => {
    return { ...state, siteConfig: payload, SettingsError: null };
  }),

  on(SettingsActions.SuccessGetActiveCategoriesAction, (state: SettingsState, { payload }) => {
    return { ...state, categories: payload, SettingsError: null };
  }),

  on(SettingsActions.SuccessGetActiveCategoriesAction, (state: SettingsState, { payload }) => {
    return { ...state, categories: payload, SettingsError: null };
  }),


  on(SettingsActions.ErrorSettingsAction, (state: SettingsState, error: Error) => {
    return { ...state, SettingsError: error };
  })
);

export function SettingsReducer(
  state: SettingsState | undefined,
  action: Action
): SettingsState {
  return reducer(state, action);
}
