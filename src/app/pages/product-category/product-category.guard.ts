import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import SettingsState from 'src/app/services/store/settings/settings.state';
import { Entry } from 'contentful';
import * as ProductsActions from 'src/app/services/store/product/product.action';
import { NavigationService } from 'src/app/services/navigation/navigation.service';

@Injectable({
  providedIn: 'root',
})
export class ProductCategoryGuard implements CanActivate {


  categories$: Observable<Entry<any>[]>;
  categories: Entry<any>[];

  constructor(private router: Router,private store: Store<{ settings: SettingsState }>, private navService: NavigationService) {
    this.categories$ = store.select('settings', 'categories');
    this.categories$.pipe(
      map(x => {
        this.categories = x;
      }
      )).subscribe();
  }


  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    this.navService.startLoading();
    return from(new Promise<any>((resolve, reject) => {
      let catExists = false;
      if (this.categories) {
        this.categories.forEach(function (category) {
          if (category.fields.name == route.params['category']) {
            this.store.dispatch(ProductsActions.BeginSetActiveCategoryAction({ payload: category }));
            this.store.dispatch(ProductsActions.BeginLoadProductsAction({ payload: category.sys.id }));
            catExists = true;
            resolve(catExists);
          }
        }.bind(this));
      }
      if (!catExists) {
        this.router.navigate(['/'])
      }
    }).then());
  }
}
