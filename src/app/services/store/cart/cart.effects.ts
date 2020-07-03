import { Injectable } from '@angular/core';
import { Observable, of, from } from 'rxjs';
import { Action } from '@ngrx/store';
import { catchError, map, switchMap } from 'rxjs/operators';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import * as CartActions from './cart.action';
import { FirestoreService } from '../../firestore/firestore.service';
import { ContentfulService } from '../../contentful/contentful.service';



@Injectable()
export class CartEffects {
  constructor(
    private action$: Actions, 
    private firestoreService: FirestoreService,
    private contentfulService: ContentfulService) {}

  InitializeOrder$: Observable<Action> = createEffect(() =>
    this.action$.pipe(
      ofType(CartActions.BeginInitializeOrderAction),
      switchMap(action =>
        this.firestoreService.
          initOrder(action.payload).pipe(
            switchMap((result) => [
              CartActions.SuccessSetOrderTotalAction({ payload: action.payload.cart.total }),
              CartActions.SuccessInitializeOrderAction({ payload: result.id }),
              CartActions.BeginGetCartAction({ payload: result.id })
          ])
          ,
          catchError((error: Error) => {
            return of(CartActions.ErrorCartAction(error));
          })
        )
      )
    )
  );

  SetOrderShipping$: Observable<Action> = createEffect(() =>
  this.action$.pipe(
    ofType(CartActions.BeginSetOrderShippingAction),
    switchMap(action =>
      this.firestoreService.
      setOrderShippingInfo(action.payload.address , action.payload.personalInfo,  action.payload.cartId).pipe(
        map((result) => {
          return CartActions.SuccessSetOrderShippingAction({ payload: action.payload.address });
        }),
        catchError((error: Error) => {
          return of(CartActions.ErrorCartAction(error));
        })
      )
    )
  )
);

  SetStripeToken$: Observable<Action> = createEffect(() =>
  this.action$.pipe(
    ofType(CartActions.BeginSetStripeTokenAction),
    switchMap(action =>
      this.firestoreService.
      setStripeToken(action.payload.source ,  action.payload.cartId).pipe(
        map((result) => {
          if (result.code == 400) {
            return CartActions.SuccessStripePaymentAction();
          } else {
            return CartActions.SuccessSetStripeTokenAction({ payload: action.payload.source });
          }
        }),
        catchError((error: Error) => {
          return of(CartActions.ErrorCartAction(error));
        })
      )
    )
  )
  );


  GetOrder$: Observable<Action> = createEffect(() =>
    this.action$.pipe(
      ofType(CartActions.BeginGetCartAction),
      switchMap(action =>
        this.firestoreService.
          getCart(action.payload).pipe(
          map((result) => {
            return CartActions.SuccessGetCartAction({ payload: result.payload.data() });
          }),
          catchError((error: Error) => {
            return of(CartActions.ErrorCartAction(error));
          })
        )
      )
    )
  );
}
