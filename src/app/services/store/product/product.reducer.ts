import { Action, createReducer, on } from '@ngrx/store';
import ProductsState, { initializeState } from './product.state';
import * as ProductsActions from './product.action';

const initialState = initializeState();

const reducer = createReducer(
  initialState,

  on(ProductsActions.BeginSetActiveCategoryAction, (state: ProductsState, { payload }) => {
    return { ...state, activeCategory: payload, ProductsError: null };
  }),

  on(ProductsActions.SuccessLoadProductsAction, (state: ProductsState, { payload }) => {
    return { ...state, loadedProducts: payload, ProductsError: null };
  }),

  on(ProductsActions.SuccessSearchProductsAction, (state: ProductsState, { payload }) => {
    return { ...state, searchResults: payload, ProductsError: null };
  }),

  on(ProductsActions.BeginLoadProductDetailsAction, (state: ProductsState, { payload }) => {
    return { ...state, productDetails: payload, ProductsError: null };
  }),

  on(ProductsActions.SuccessLoadProductReviewsAction, (state: ProductsState, { payload }) => {
    return { ...state, reviews: payload, ProductsError: null };
  }),

  on(ProductsActions.ErrorProductsAction, (state: ProductsState, error: Error) => {
    return { ...state, ProductsError: error };
  })
);

export function ProductsReducer(
  state: ProductsState | undefined,
  action: Action
): ProductsState {
  return reducer(state, action);
}
