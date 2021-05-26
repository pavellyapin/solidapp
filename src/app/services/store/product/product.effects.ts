import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType} from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, map, mergeMap, first } from 'rxjs/operators';
import * as ProductsActions from './product.action';
import { ContentfulService } from '../../contentful/contentful.service';
import { FirestoreService } from '../../firestore/firestore.service';

@Injectable()
export class ProductsEffects {
  constructor(
        private action$: Actions, 
        private contentfulService: ContentfulService,
        private firestoreService: FirestoreService) {}

  GetProducts$: Observable<Action> = createEffect(() =>
    this.action$.pipe(
      ofType(ProductsActions.BeginLoadProductsAction),
      mergeMap(action =>
        this.contentfulService.getCategoryProducts(action.payload).pipe(
          map((data: any) => {
            return ProductsActions.SuccessLoadProductsAction({ payload: data });
          }),
          catchError((error: Error) => {
            return of(ProductsActions.ErrorProductsAction(error));
          })
        )
      )
    )
  );

  SearchProducts$: Observable<Action> = createEffect(() =>
  this.action$.pipe(
    ofType(ProductsActions.BeginSearchProductsAction),
    mergeMap(action =>
      this.contentfulService.searchProducts(action.payload).pipe(
        map((data: any) => {
          return ProductsActions.SuccessSearchProductsAction({ payload: data });
        }),
        catchError((error: Error) => {
          return of(ProductsActions.ErrorProductsAction(error));
        })
      )
    )
  )
);

  WriteProductReview$: Observable<Action> = createEffect(() =>
  this.action$.pipe(
    ofType(ProductsActions.BeginWriteProductReviewAction),
    mergeMap(action =>
      this.firestoreService.addProductReview(action.payload.productId , action.payload.review).pipe(
        map((data: any) => {
          return ProductsActions.SuccessWriteProductReviewAction();
        }),
        catchError((error: Error) => {
          return of(ProductsActions.ErrorProductsAction(error));
        })
      )
    )
  )
);

GetProductReview$: Observable<Action> = createEffect(() =>
this.action$.pipe(
  ofType(ProductsActions.BeginLoadProductReviewsAction),
  mergeMap(action =>
    this.firestoreService.getProductReviews(action.payload).pipe(first(),
      map((data: any) => {
        let reviews = Array<any>();
        data.forEach(element => {
          reviews.push( element.payload.doc.data());
        });
        return ProductsActions.SuccessLoadProductReviewsAction({ payload: reviews });
      }),
      catchError((error: Error) => {
        return of(ProductsActions.ErrorProductsAction(error));
      })
    )
  )
)
);
}
