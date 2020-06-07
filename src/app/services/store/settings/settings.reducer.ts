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

  on(SettingsActions.SuccessGetAllPagesAction, (state: SettingsState, { payload }) => {
    return { ...state, pages: payload, SettingsError: null };
  }),

  on(SettingsActions.SuccessSetResolutionAction, (state: SettingsState, { payload }) => {
    return { ...state, resolution: payload, SettingsError: null };
  }),

  //LOADING....
  on(SettingsActions.BeginLoadingAction, (state: SettingsState, {}) => {
    return { ...state, loading: true, SettingsError: null };
  }),

  on(SettingsActions.SuccessLoadingAction, (state: SettingsState, {}) => {
    return { ...state, loading: false, SettingsError: null };
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
