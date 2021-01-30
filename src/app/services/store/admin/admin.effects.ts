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

  DeleteCustomers$: Observable<Action> = createEffect(() =>
    this.action$.pipe(
      ofType(AdminActions.BeginDeleteCustomersAction),
      mergeMap(action =>
        this.adminService.deleteCustomers(action.payload).pipe(
          map((data: any) => {
            return AdminActions.SuccessDeleteCustomersAction();
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

}
