import { Action, createReducer, on } from '@ngrx/store';
import * as AdminActions from './admin.action';
import AdminState, { initializeState } from './admin.state';

const initialState = initializeState();

const reducer = createReducer(
  initialState,

  on(AdminActions.SuccessLoadCustomersAction, (state: AdminState, { payload }) => {
    return { ...state, customers: payload, AdminError: null };
  }),

  on(AdminActions.SuccessLoadOrdersAction, (state: AdminState, { payload }) => {
    return { ...state, orders: payload, AdminError: null };
  }),

  on(AdminActions.ErrorAdminAction, (state: AdminState, error: Error) => {
    return { ...state, AdminError: error };
  })
);

export function AdminReducer(
  state: AdminState | undefined,
  action: Action
): AdminState {
  return reducer(state, action);
}
