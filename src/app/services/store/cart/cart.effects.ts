import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Action } from '@ngrx/store';
import { catchError, map, switchMap } from 'rxjs/operators';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import * as CartActions from './cart.action';
import { FirestoreService } from '../../firestore/firestore.service';



@Injectable()
export class CartEffects {
  constructor(
    private action$: Actions, 
    private firestoreService: FirestoreService) {}

  InitializeOrder$: Observable<Action> = createEffect(() =>
    this.action$.pipe(
      ofType(CartActions.BeginInitializeOrderAction),
      switchMap(action =>
        this.firestoreService.
          initOrder(action.payload).pipe(
          map((result) => {
            return CartActions.SuccessInitializeOrderAction({ payload: result.id });
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
            return CartActions.SuccessGetCartAction({ payload: result });
          }),
          catchError((error: Error) => {
            return of(CartActions.ErrorCartAction(error));
          })
        )
      )
    )
  );
}
