import { createAction, props } from '@ngrx/store';

export const SuccessSetAdminEnvAction = createAction('[admin] - Success set admin env',props<{ payload: any }>());

export const BeginLoadCustomersAction = createAction('[admin] - Begin LOAD customers');
export const SuccessLoadCustomersAction = createAction('[admin] - Success LOAD customers',props<{ payload: any }>());

export const BeginLoadCustomerDetailsAction = createAction('[admin] - Begin LOAD customer details',props<{ payload: any }>());
export const SuccessLoadCustomerDetailsAction = createAction('[admin] - Success LOAD customer details',props<{ payload: any }>());

export const BeginLoadCustomerOrdersAction = createAction('[admin] - Begin LOAD customer orders',props<{ payload: any }>());
export const SuccessLoadCustomerOrdersAction = createAction('[admin] - Success LOAD customer orders',props<{ payload: any }>());

export const BeginLoadOrdersAction = createAction('[admin] - Begin LOAD orders');
export const SuccessLoadOrdersAction = createAction('[admin] - Success LOAD orders',props<{ payload: any }>());

export const BeginLoadNewOrdersAction = createAction('[admin] - Begin LOAD new orders');
export const SuccessLoadNewOrdersAction = createAction('[admin] - Success LOAD new orders',props<{ payload: any }>());

export const BeginStatsPerPeriodAction = createAction('[admin] - Begin stats per period',props<{ payload: any }>());
export const SuccessStatsPerPeriodAction = createAction('[admin] - Success stats per period',props<{ payload: any }>());

export const SuccessResetDashboardHomeAction = createAction('[admin] - Success reset dashboard home');





export const BeginLoadOrderDetailsAction = createAction('[admin] - Begin LOAD order details',props<{ payload: any }>());
export const SuccessLoadOrderDetailsAction = createAction('[admin] - Success LOAD order details',props<{ payload: any }>());

export const BeginFulfillOrderAction = createAction('[admin] - Begin fulfill order',props<{ payload: any }>());
export const SuccessFulfillOrderAction = createAction('[admin] - Success fulfill order',props<{ payload: any }>());

export const BeginUnfulfillOrderAction = createAction('[admin] - Begin unfulfill order',props<{ payload: any }>());
export const SuccessUnfulfillOrderAction = createAction('[admin] - Success unfulfill order',props<{ payload: any }>());

export const BeginLoadCartsAction = createAction('[admin] - Begin LOAD carts');
export const SuccessLoadCartsAction = createAction('[admin] - Success LOAD carts',props<{ payload: any }>());

export const BeginDeleteCartsAction = createAction('[admin] - Begin DELETE carts',props<{ payload: any }>());
export const SuccessDeleteCartsAction = createAction('[admin] - Success DELETE carts');

export const BeginLoadCartDetailsAction = createAction('[admin] - Begin LOAD cart details',props<{ payload: any }>());
export const SuccessLoadCartDetailsAction = createAction('[admin] - Success LOAD cart details',props<{ payload: any }>());

export const BeginReviewCartAction = createAction('[admin] - Begin review cart',props<{ payload: any }>());
export const SuccessReviewCartAction = createAction('[admin] - Success review cart',props<{ payload: any }>());

export const BeginUnReviewCartAction = createAction('[admin] - Begin unreview cart',props<{ payload: any }>());
export const SuccessUnReviewCartAction = createAction('[admin] - Success unreview cart',props<{ payload: any }>());


export const BeginLoadSubscriptionsAction = createAction('[admin] - Begin LOAD Subscriptions');
export const SuccessLoadSubscriptionsAction = createAction('[admin] - Success LOAD Subscriptions',props<{ payload: any }>());

export const BeginDeleteSubscriptionsAction = createAction('[admin] - Begin DELETE Subscriptions',props<{ payload: any }>());
export const SuccessDeleteSubscriptionsAction = createAction('[admin] - Success DELETE Subscriptions');

export const BeginLoadSubscriptionDetailsAction = createAction('[admin] - Begin LOAD Subscription details',props<{ payload: any }>());
export const SuccessLoadSubscriptionDetailsAction = createAction('[admin] - Success LOAD Subscription details',props<{ payload: any }>());

export const BeginReviewSubscriptionAction = createAction('[admin] - Begin review Subscription',props<{ payload: any }>());
export const SuccessReviewSubscriptionAction = createAction('[admin] - Success review Subscription',props<{ payload: any }>());

export const BeginUnReviewSubscriptionAction = createAction('[admin] - Begin unreview Subscription',props<{ payload: any }>());
export const SuccessUnReviewSubscriptionAction = createAction('[admin] - Success unreview Subscription',props<{ payload: any }>());

export const BeginSendEmailAction = createAction('[admin] - Begin send email',props<{ payload: any }>());
export const SuccessSendEmailAction = createAction('[admin] - Success send email',props<{ payload: any }>());

export const ErrorAdminAction = createAction('[admin] - Error', props<Error>());
