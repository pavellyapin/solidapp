import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType} from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import * as ProductsActions from './product.action';
import { ContentfulService } from '../../contentful/contentful.service';

@Injectable()
export class ProductsEffects {
  constructor(
        private action$: Actions, 
        private contentfulService: ContentfulService) {}

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
}
