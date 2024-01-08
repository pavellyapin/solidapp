import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import * as AdminActions from './admin.action';
import { AdminService } from '../../admin/admin.service';

@Injectable()
export class AdminEffects {
  constructor(
    private action$: Actions,
    private adminService: AdminService) { }

  GetCustomers$: Observable<Action> = createEffect(() =>
    this.action$.pipe(
      ofType(AdminActions.BeginLoadCustomersAction),
      mergeMap(action =>
        this.adminService.getCustomers().pipe(
          map((data: any) => {
            return AdminActions.SuccessLoadCustomersAction({ payload: data });
          }),
          catchError((error: Error) => {
            return of(AdminActions.ErrorAdminAction(error));
          })
        )
      )
    )
  );

  GetCustomerDetails$: Observable<Action> = createEffect(() =>
    this.action$.pipe(
      ofType(AdminActions.BeginLoadCustomerDetailsAction),
      mergeMap(action =>
        this.adminService.getCustomerDetails(action.payload).pipe(
          map((data: any) => {
            return AdminActions.SuccessLoadCustomerDetailsAction({ payload: data });
          }),
          catchError((error: Error) => {
            return of(AdminActions.ErrorAdminAction(error));
          })
        )
      )
    )
  );

  GetCustomerOrders$: Observable<Action> = createEffect(() =>
    this.action$.pipe(
      ofType(AdminActions.BeginLoadCustomerOrdersAction),
      mergeMap(action =>
        this.adminService.getCustomerOrders(action.payload).pipe(
          map((data: any) => {
            return AdminActions.SuccessLoadCustomerOrdersAction({ payload: data });
          }),
          catchError((error: Error) => {
            return of(AdminActions.ErrorAdminAction(error));
          })
        )
      )
    )
  );

  GetOrders$: Observable<Action> = createEffect(() =>
    this.action$.pipe(
      ofType(AdminActions.BeginLoadOrdersAction),
      mergeMap(action =>
        this.adminService.getOrders().pipe(
          map((data: any) => {
            return AdminActions.SuccessLoadOrdersAction({ payload: data });
          }),
          catchError((error: Error) => {
            return of(AdminActions.ErrorAdminAction(error));
          })
        )
      )
    )
  );

  GetNewOrders$: Observable<Action> = createEffect(() =>
    this.action$.pipe(
      ofType(AdminActions.BeginLoadNewOrdersAction),
      mergeMap(action =>
        this.adminService.getNewOrders().pipe(
          map((data: any) => {
            return AdminActions.SuccessLoadNewOrdersAction({ payload: data });
          }),
          catchError((error: Error) => {
            return of(AdminActions.ErrorAdminAction(error));
          })
        )
      )
    )
  );

  StatsPerPeriod$: Observable<Action> = createEffect(() =>
    this.action$.pipe(
      ofType(AdminActions.BeginStatsPerPeriodAction),
      mergeMap(action =>
        this.adminService.statsForPeriod(action.payload.quickLook, action.payload.startDate, action.payload.endDate).pipe(
          map((data: any) => {
            return AdminActions.SuccessStatsPerPeriodAction({ payload: data });
          }),
          catchError((error: Error) => {
            return of(AdminActions.ErrorAdminAction(error));
          })
        )
      )
    )
  );

  GetOrderDetails$: Observable<Action> = createEffect(() =>
    this.action$.pipe(
      ofType(AdminActions.BeginLoadOrderDetailsAction),
      mergeMap(action =>
        this.adminService.getOrderDetails(action.payload.uid, action.payload.orderId).pipe(
          map((data: any) => {
            return AdminActions.SuccessLoadOrderDetailsAction({ payload: data });
          }),
          catchError((error: Error) => {
            return of(AdminActions.ErrorAdminAction(error));
          })
        )
      )
    )
  );

  DeliverOrder$: Observable<Action> = createEffect(() =>
    this.action$.pipe(
      ofType(AdminActions.BeginDeliverOrderAction),
      mergeMap(action =>
        this.adminService.deliverOrder(action.payload.uid, action.payload.orderId).pipe(
          map((data: any) => {
            return AdminActions.SuccessDeliverOrderAction({ payload: data });
          }),
          catchError((error: Error) => {
            return of(AdminActions.ErrorAdminAction(error));
          })
        )
      )
    )
  );

  UndeliverOrder$: Observable<Action> = createEffect(() =>
    this.action$.pipe(
      ofType(AdminActions.BeginUndeliverOrderAction),
      mergeMap(action =>
        this.adminService.undeliverOrder(action.payload.uid, action.payload.orderId).pipe(
          map((data: any) => {
            return AdminActions.SuccessUndeliverOrderAction({ payload: data });
          }),
          catchError((error: Error) => {
            return of(AdminActions.ErrorAdminAction(error));
          })
        )
      )
    )
  );

  FulfillOrder$: Observable<Action> = createEffect(() =>
    this.action$.pipe(
      ofType(AdminActions.BeginFulfillOrderAction),
      mergeMap(action =>
        this.adminService.fullFillOrder(action.payload.uid, action.payload.orderId).pipe(
          map((data: any) => {
            return AdminActions.SuccessFulfillOrderAction({ payload: data });
          }),
          catchError((error: Error) => {
            return of(AdminActions.ErrorAdminAction(error));
          })
        )
      )
    )
  );

  UnfulfillOrder$: Observable<Action> = createEffect(() =>
    this.action$.pipe(
      ofType(AdminActions.BeginUnfulfillOrderAction),
      mergeMap(action =>
        this.adminService.unfullFillOrder(action.payload.uid, action.payload.orderId).pipe(
          map((data: any) => {
            return AdminActions.SuccessUnfulfillOrderAction({ payload: data });
          }),
          catchError((error: Error) => {
            return of(AdminActions.ErrorAdminAction(error));
          })
        )
      )
    )
  );

  GetCarts$: Observable<Action> = createEffect(() =>
    this.action$.pipe(
      ofType(AdminActions.BeginLoadCartsAction),
      mergeMap(action =>
        this.adminService.getCarts().pipe(
          map((data: any) => {
            return AdminActions.SuccessLoadCartsAction({ payload: data });
          }),
          catchError((error: Error) => {
            return of(AdminActions.ErrorAdminAction(error));
          })
        )
      )
    )
  );

  DeleteCarts$: Observable<Action> = createEffect(() =>
    this.action$.pipe(
      ofType(AdminActions.BeginDeleteCartsAction),
      mergeMap(action =>
        this.adminService.deleteCarts(action.payload).pipe(
          map((data: any) => {
            return AdminActions.SuccessDeleteCartsAction();
          }),
          catchError((error: Error) => {
            return of(AdminActions.ErrorAdminAction(error));
          })
        )
      )
    )
  );

  GetCartDetails$: Observable<Action> = createEffect(() =>
    this.action$.pipe(
      ofType(AdminActions.BeginLoadCartDetailsAction),
      mergeMap(action =>
        this.adminService.getCartDetails(action.payload.uid, action.payload.cartId).pipe(
          map((data: any) => {
            return AdminActions.SuccessLoadCartDetailsAction({ payload: data });
          }),
          catchError((error: Error) => {
            return of(AdminActions.ErrorAdminAction(error));
          })
        )
      )
    )
  );

  ReviewCart$: Observable<Action> = createEffect(() =>
    this.action$.pipe(
      ofType(AdminActions.BeginReviewCartAction),
      mergeMap(action =>
        this.adminService.reviewCart(action.payload.uid, action.payload.cartId).pipe(
          map((data: any) => {
            return AdminActions.SuccessReviewCartAction({ payload: data });
          }),
          catchError((error: Error) => {
            return of(AdminActions.ErrorAdminAction(error));
          })
        )
      )
    )
  );

  UnreviewCart$: Observable<Action> = createEffect(() =>
    this.action$.pipe(
      ofType(AdminActions.BeginUnReviewCartAction),
      mergeMap(action =>
        this.adminService.unreviewCart(action.payload.uid, action.payload.cartId).pipe(
          map((data: any) => {
            return AdminActions.SuccessUnReviewCartAction({ payload: data });
          }),
          catchError((error: Error) => {
            return of(AdminActions.ErrorAdminAction(error));
          })
        )
      )
    )
  );


  GetSubscriptions$: Observable<Action> = createEffect(() =>
    this.action$.pipe(
      ofType(AdminActions.BeginLoadSubscriptionsAction),
      mergeMap(action =>
        this.adminService.getSubscriptions().pipe(
          map((data: any) => {
            return AdminActions.SuccessLoadSubscriptionsAction({ payload: data });
          }),
          catchError((error: Error) => {
            return of(AdminActions.ErrorAdminAction(error));
          })
        )
      )
    )
  );

  DeleteSubscriptions$: Observable<Action> = createEffect(() =>
    this.action$.pipe(
      ofType(AdminActions.BeginDeleteSubscriptionsAction),
      mergeMap(action =>
        this.adminService.deleteSubscriptions(action.payload).pipe(
          map((data: any) => {
            return AdminActions.SuccessDeleteSubscriptionsAction();
          }),
          catchError((error: Error) => {
            return of(AdminActions.ErrorAdminAction(error));
          })
        )
      )
    )
  );

  GetSubscriptionDetails$: Observable<Action> = createEffect(() =>
    this.action$.pipe(
      ofType(AdminActions.BeginLoadSubscriptionDetailsAction),
      mergeMap(action =>
        this.adminService.getSubscriptionDetails(action.payload.uid, action.payload.subscriptionId).pipe(
          map((data: any) => {
            return AdminActions.SuccessLoadSubscriptionDetailsAction({ payload: data });
          }),
          catchError((error: Error) => {
            return of(AdminActions.ErrorAdminAction(error));
          })
        )
      )
    )
  );

  ReviewSubscription$: Observable<Action> = createEffect(() =>
    this.action$.pipe(
      ofType(AdminActions.BeginReviewSubscriptionAction),
      mergeMap(action =>
        this.adminService.reviewSubscription(action.payload.uid, action.payload.subscriptionId).pipe(
          map((data: any) => {
            return AdminActions.SuccessReviewSubscriptionAction({ payload: data });
          }),
          catchError((error: Error) => {
            return of(AdminActions.ErrorAdminAction(error));
          })
        )
      )
    )
  );

  UnreviewSubscription$: Observable<Action> = createEffect(() =>
    this.action$.pipe(
      ofType(AdminActions.BeginUnReviewSubscriptionAction),
      mergeMap(action =>
        this.adminService.unreviewSubscription(action.payload.uid, action.payload.subscriptionId).pipe(
          map((data: any) => {
            return AdminActions.SuccessUnReviewSubscriptionAction({ payload: data });
          }),
          catchError((error: Error) => {
            return of(AdminActions.ErrorAdminAction(error));
          })
        )
      )
    )
  );

  SendEmail$: Observable<Action> = createEffect(() =>
    this.action$.pipe(
      ofType(AdminActions.BeginSendEmailAction),
      mergeMap(action =>
        this.adminService.sendEmail(action.payload.uid, action.payload.subscriptionId, action.payload.email).pipe(
          map((data: any) => {
            return AdminActions.SuccessSendEmailAction({ payload: data });
          }),
          catchError((error: Error) => {
            return of(AdminActions.ErrorAdminAction(error));
          })
        )
      )
    )
  );

}
