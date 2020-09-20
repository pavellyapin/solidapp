import { createAction, props } from '@ngrx/store';


//Reset Actions
export const BeginResetCartAction = createAction('[Cart] - Reset cart');

export const BeginResetCartIdAction = createAction('[Cart] - Reset cart id');
///////

//Get Cart
export const BeginGetCartAction = createAction('[Cart] - Begin Get cart',props<{ payload: any }>());

export const SuccessGetCartAction = createAction('[Cart] - Success get cart',props<{ payload: any }>());
//////

//Set Status
export const BeginSetCartStatusAction = createAction('[Cart] - Begin Set status',props<{ payload: any }>());

export const SuccessSetCartStatusAction = createAction('[Cart] - Success set status');
//////


//Add/Remove product to cart
export const BeginAddProductToCartAction = createAction('[Cart] - Add product to cart',props<{ payload: any }>());

export const BeginRemoveProductFromCartAction = createAction('[Cart] - Remove product from cart',props<{ payload: any }>());
////////

//Initialize Order

 export const BeginInitializeOrderAction = createAction('[Cart] - Begin Initialize Order',props<{ payload: any }>()); 

  export const BeginBackGroundInitializeOrderAction = createAction('[Cart] - Begin Background Initialize Order',props<{ payload: any }>()); 

  export const SuccessInitializeOrderAction = createAction('[Cart] - Success Initialize Order',props<{ payload: any }>()); 

  export const SuccessBackGroundInitializeOrderAction = createAction('[Cart] - Success Initialize Order',props<{ payload: any }>()); 

  ///////

  export const SuccessSetOrderTotalAction = createAction('[Cart] - Begin Set Order Total',props<{ payload: any }>()); 

  export const BeginSetOrderShippingAction = createAction('[Cart] - Begin Set Order shipping',props<{ payload: any }>()); 

  export const SuccessSetOrderShippingAction = createAction('[Cart] - Success Set Order shipping',props<{ payload: any }>()); 

  export const BeginSetShippingMethodAction = createAction('[Cart] - Begin Set Shipping Method',props<{ payload: any }>()); 

  //Payment

  export const BeginSetStripeTokenAction = createAction('[Cart] - Begin Set Stripe token',props<{ payload: any }>()); 

  export const SuccessSetStripeTokenAction = createAction('[Cart] - Success Set Stripe token',props<{ payload: any }>()); 

  export const SuccessStripePaymentAction = createAction('[Cart] - Success Payment with stripe');  

export const ErrorCartAction = createAction('[Cart] - Error', props<Error>());
