import { Action, createReducer, on } from '@ngrx/store';
import * as AdminActions from './admin.action';
import AdminState, { initializeState } from './admin.state';

const initialState = initializeState();

const reducer = createReducer(
  initialState,

  on(AdminActions.SuccessSetAdminEnvAction,
    (state: AdminState, {payload}) => {
      return {
        ...state,
        env: payload,
        UserError: null
      }
    }),

  on(AdminActions.SuccessLoadNewOrdersAction, (state: AdminState, { payload }) => {
    return { ...state, newOrders: payload, AdminError: null };
  }),

  on(AdminActions.SuccessStatsPerPeriodAction, (state: AdminState, { payload }) => {
    return { ...state, stats: payload, AdminError: null };
  }),

  on(AdminActions.SuccessResetDashboardHomeAction, (state: AdminState, {}) => {
    return { ...state, stats: null, newOrders: null, AdminError: null };
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
