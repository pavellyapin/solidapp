import { createAction, props } from '@ngrx/store';


//Set Active Category
export const BeginSetActiveCategoryAction = createAction(
  '[Products] - Set active category',
  props<{ payload: any }>()
);


export const BeginLoadProductsAction = createAction(
  '[Products] - Begin LOAD',
  props<{ payload: any }>()
);

export const SuccessLoadProductsAction = createAction(
  '[Product] - Success LOAD',
  props<{ payload: any }>()
);

//Search Products

export const BeginSearchProductsAction = createAction(
  '[Products] - Begin SEARCH',
  props<{ payload: any }>()
);

export const SuccessSearchProductsAction = createAction(
  '[Product] - Success SEARCH',
  props<{ payload: any }>()
);

//Load Product Details

export const BeginLoadProductDetailsAction = createAction(
  '[Products] - Begin LOAD DETAILS',
  props<{ payload: any }>()
);

//Product Reviews

export const BeginLoadProductReviewsAction = createAction(
  '[Products] - Begin load reviews',
  props<{ payload: any }>()
);

export const SuccessLoadProductReviewsAction = createAction(
  '[Product] - Success load reviews',
  props<{ payload: any }>()
);

export const BeginWriteProductReviewAction = createAction(
  '[Products] - Begin write review',
  props<{ payload: any }>()
);

export const SuccessWriteProductReviewAction = createAction(
  '[Products] - Success write review'
);

export const ErrorProductsAction = createAction('[Product] - Error', props<Error>());
