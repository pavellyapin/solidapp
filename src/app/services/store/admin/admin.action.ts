import { createAction, props } from '@ngrx/store';

export const BeginLoadCustomersAction = createAction('[admin] - Begin LOAD customers');
export const SuccessLoadCustomersAction = createAction('[admin] - Success LOAD customers',props<{ payload: any }>());

export const BeginLoadCartsAction = createAction('[admin] - Begin LOAD carts');
export const SuccessLoadCartsAction = createAction('[admin] - Success LOAD carts',props<{ payload: any }>());

export const BeginDeleteCustomersAction = createAction('[admin] - Begin DELETE customers',props<{ payload: any }>());
export const SuccessDeleteCustomersAction = createAction('[admin] - Success DELETE customers');

export const BeginLoadCustomerDetailsAction = createAction('[admin] - Begin LOAD customer details',props<{ payload: any }>());
export const SuccessLoadCustomerDetailsAction = createAction('[admin] - Success LOAD customer details',props<{ payload: any }>());

export const BeginLoadCustomerOrdersAction = createAction('[admin] - Begin LOAD customer orders',props<{ payload: any }>());
export const SuccessLoadCustomerOrdersAction = createAction('[admin] - Success LOAD customer orders',props<{ payload: any }>());

export const BeginLoadOrdersAction = createAction('[admin] - Begin LOAD orders');
export const SuccessLoadOrdersAction = createAction('[admin] - Success LOAD orders',props<{ payload: any }>());

export const BeginLoadOrderDetailsAction = createAction('[admin] - Begin LOAD order details',props<{ payload: any }>());
export const SuccessLoadOrderDetailsAction = createAction('[admin] - Success LOAD order details',props<{ payload: any }>());


export const ErrorAdminAction = createAction('[admin] - Error', props<Error>());
