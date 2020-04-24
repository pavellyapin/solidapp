import { createAction, props } from '@ngrx/store';

export const BeginResetCartAction = createAction(
  '[Cart] - Reset cart'
);

export const BeginGetCartAction = createAction(
  '[Cart] - Begin Get cart',
  props<{ payload: any }>()
);

export const SuccessGetCartAction = createAction(
  '[Cart] - Success get cart',
  props<{ payload: any }>()
);

export const BeginAddProductToCartAction = createAction(
  '[Cart] - Add product to cart',
  props<{ payload: any }>()
);

export const BeginRemoveProductFromCartAction = createAction(
    '[Cart] - Remove product from cart',
    props<{ payload: any }>()
  );

 export const BeginInitializeOrderAction = createAction(
    '[Cart] - Begin Initialize Order',
    props<{ payload: any }>()
  ); 

  export const SuccessInitializeOrderAction = createAction(
    '[Cart] - Success Initialize Order',
    props<{ payload: any }>()
    
  ); 

export const ErrorCartAction = createAction('[Cart] - Error', props<Error>());
