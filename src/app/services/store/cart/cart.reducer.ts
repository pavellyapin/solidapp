import { Action, createReducer, on } from '@ngrx/store';
import CartState, { initializeState } from './cart.state';
import * as CartActions from './cart.action';

const initialState = initializeState();

const reducer = createReducer(
  initialState,

  on(CartActions.BeginResetCartAction, (state: CartState, {}) => {
    return { ...state, 
            items: [],
            addressInfo : null,
            cartId: null, 
            total: null,
            order:null,
            shippingMethod : null,
            CartError: null };
  }),

  on(CartActions.BeginResetCartIdAction, (state: CartState, {}) => {
    return { ...state, 
            cartId: null, 
            CartError: null };
  }),
  
  on(CartActions.BeginAddProductToCartAction, (state: CartState, { payload }) => {
    return { ...state, 
            items: [payload, ...state.items], 
            CartError: null };
  }),

  on(CartActions.BeginRemoveProductFromCartAction, (state: CartState, { payload }) => {
    return { ...state, 
            items: [
                ...state.items.slice(0, payload),
                ...state.items.slice(payload + 1)
            ], 
            CartError: null };
  }),

  on(CartActions.SuccessInitializeOrderAction, (state: CartState, { payload }) => {
    return { ...state, 
            cartId: payload, 
            CartError: null };
  }),

  on(CartActions.SuccessBackGroundInitializeOrderAction, (state: CartState, { payload }) => {
    return { ...state, 
            cartId: payload, 
            CartError: null };
  }),

  on(CartActions.SuccessSetOrderTotalAction, (state: CartState, { payload }) => {
    return { ...state, 
            total: payload, 
            CartError: null };
  }),

  on(CartActions.SuccessSetOrderShippingAction, (state: CartState, { payload }) => {
    return { ...state, 
            addressInfo: payload, 
            CartError: null };
  }),

  on(CartActions.BeginSetShippingMethodAction, (state: CartState, { payload }) => {
    return { ...state, 
            shippingMethod: payload, 
            CartError: null };
  }),

  on(CartActions.SuccessGetCartAction, (state: CartState, { payload }) => {
    return { ...state, 
            order: payload, 
            CartError: null };
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
