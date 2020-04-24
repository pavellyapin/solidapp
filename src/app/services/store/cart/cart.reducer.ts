import { Action, createReducer, on } from '@ngrx/store';
import CartState, { initializeState } from './cart.state';
import * as CartActions from './cart.action';

const initialState = initializeState();

const reducer = createReducer(
  initialState,

  on(CartActions.BeginResetCartAction, (state: CartState, {}) => {
    return { ...state, 
            items: [],
            cartId: null, 
            SettingsError: null };
  }),
  
  on(CartActions.BeginAddProductToCartAction, (state: CartState, { payload }) => {
    return { ...state, 
            items: [payload, ...state.items], 
            SettingsError: null };
  }),

  on(CartActions.BeginRemoveProductFromCartAction, (state: CartState, { payload }) => {
    return { ...state, 
            items: [
                ...state.items.slice(0, payload),
                ...state.items.slice(payload + 1)
            ], 
            SettingsError: null };
  }),

  on(CartActions.SuccessInitializeOrderAction, (state: CartState, { payload }) => {
    return { ...state, 
            cartId: payload, 
            SettingsError: null };
  }),


  on(CartActions.ErrorCartAction, (state: CartState, error: Error) => {
    return { ...state, CartError: error };
  })
);

export function CartReducer(
  state: CartState | undefined,
  action: Action
): CartState {
  return reducer(state, action);
}
