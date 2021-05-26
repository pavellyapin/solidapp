import { Action, createReducer, on } from '@ngrx/store';
import UserState, { initializeState } from './user.state';
import * as UserActions from './user.action';

const initialState = initializeState();

const reducer = createReducer(
  initialState,

  on(UserActions.SuccessGetUserInfoAction,
    (state: UserState, { payload }) => {
      return {
        ...state,
        personalInfo: payload,
        UserError: null
      }
    }),

  on(UserActions.SuccessGetUserPermissionsAction,
    (state: UserState, { payload }) => {
      return {
        ...state,
        permissions: payload,
        UserError: null
      }
    }),

  on(UserActions.SuccessSetCartUserAction,
    (state: UserState, { payload }) => {
      return {
        ...state,
        personalInfo: payload,
        UserError: null
      }
    }),

  on(UserActions.BeginSetUserIDAction,
    (state: UserState, { payload }) => {
      return {
        ...state,
        uid: payload,
        UserError: null
      }
    }),

  on(UserActions.SuccessGetUserAddressInfoAction,
    (state: UserState, { payload }) => {
      return {
        ...state,
        addressInfo: payload,
        UserError: null
      }
    }),

  on(UserActions.SuccessGetFavoritesAction,
    (state: UserState, { payload }) => {
      return {
        ...state,
        favorites: payload,
        UserError: null
      }
    }),

  on(UserActions.SuccessGetOrdersAction,
    (state: UserState, { payload }) => {
      return {
        ...state,
        orders: payload,
        UserError: null
      }
    }),
  on(UserActions.SuccessUserLogoutAction,
    (state: UserState, { }) => {
      return {
        ...state,
        uid: null,
        personalInfo: null,
        site: null,
        addressInfo: null,
        orders: [],
        favorites: [],
        permissions : null,
        UserError: null
      }
    }),

  on(UserActions.ErrorUserAction, (state: UserState, error: Error) => {
    return { ...state, UserError: error };
  })
);

export function UserReducer(
  state: UserState | undefined,
  action: Action
): UserState {
  return reducer(state, action);
}
