import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType} from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import * as SettingsActions from './settings.action';
import { ContentfulService } from '../../contentful/contentful.service';

@Injectable()
export class SettingsEffects {
  constructor(
        private action$: Actions, 
        private contentfulService: ContentfulService) {}

  GetSettings$: Observable<Action> = createEffect(() =>
    this.action$.pipe(
      ofType(SettingsActions.BeginLoadSettingsAction),
      mergeMap(action =>
        this.contentfulService.getSettings().pipe(
          map((data: any) => {
            const theme = data.fields.theme + '.css';
            const styleElement = document.createElement('link');
            styleElement.setAttribute('rel', 'stylesheet');
            styleElement.href = theme;
            document.head.appendChild(styleElement);
            return SettingsActions.SuccessLoadSettingsAction({ payload: data });
          }),
          catchError((error: Error) => {
            return of(SettingsActions.ErrorSettingsAction(error));
          })
        )
      )
    )
  );

  GetActiveCategories$: Observable<Action> = createEffect(() =>
  this.action$.pipe(
    ofType(SettingsActions.BeginGetActiveCategoriesAction),
    mergeMap(action =>
      this.contentfulService.getActiveCategories().pipe(
        map((data: any) => {
          return SettingsActions.SuccessGetActiveCategoriesAction({ payload: data });
        }),
        catchError((error: Error) => {
          return of(SettingsActions.ErrorSettingsAction(error));
        })
      )
    )
  )
);
}
