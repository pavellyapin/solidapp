import { Action, createReducer, on } from '@ngrx/store';
import UserState, { initializeState } from './user.state';
import * as UserActions from './user.action';

const initialState = initializeState();

const reducer = createReducer(
  initialState,

  on(UserActions.SuccessGetUserInfoAction, 
    (state: UserState, { payload}) => {
      return {
        ...state,
        personalInfo: payload,
        UserError: null
      }
    }),

    on(UserActions.SuccessGetUserAddressInfoAction, 
      (state: UserState, { payload}) => {
        return {
          ...state,
          addressInfo: payload,
          UserError: null
        }
      }),

      on(UserActions.SuccessGetFavoritesAction, 
        (state: UserState, { payload}) => {
          return {
            ...state,
            favorites: payload,
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
