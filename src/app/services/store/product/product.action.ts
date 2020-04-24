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

//Load Product Details

export const BeginLoadProductDetailsAction = createAction(
  '[Products] - Begin LOAD DETAILS',
  props<{ payload: any }>()
);

export const ErrorProductsAction = createAction('[Product] - Error', props<Error>());
