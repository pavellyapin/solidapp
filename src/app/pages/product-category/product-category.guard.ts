import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
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

  constructor(private router: Router, private store: Store<{ settings: SettingsState }>, private navService: NavigationService) {
    this.categories$ = store.select('settings', 'categories');
    this.categories$.pipe(
      map(x => {
        this.categories = x;
      }
      )).subscribe();
  }


  canActivate(route: ActivatedRouteSnapshot,state: RouterStateSnapshot): Observable<boolean> {
    this.navService.startLoading();
    if (state.url.startsWith('/search/')) {
      return from( new Promise<any>((resolve, reject) => {
        this.store.dispatch(ProductsActions.BeginSearchProductsAction({payload : route.params['category']}));
        resolve(true);
      }));
    }
    return from(new Promise<any>((resolve, reject) => {
      let catExists = false;
      if (this.categories) {
        let catsArray = [];
        const activeCategory = this.categories.filter(item => item.fields.name == route.params['category']).pop();
        if (activeCategory && !activeCategory.fields.redirect) {
          catsArray.push(activeCategory.sys.id);
          const subCategories = this.categories.filter(item => {
            if (item.fields.parent && item.fields.parent.fields) {
              return item.fields.parent.fields.name == route.params['category']
            }
          }
          );
          subCategories.forEach(function (subCategory) {
            catsArray.push(subCategory.sys.id);
            this.categories.forEach(item => {
              if (item.fields.parent && item.fields.parent.fields && item.fields.parent.fields.name == subCategory.fields.name) {
                catsArray.push(item.sys.id);
              }
            });
          }.bind(this));

          this.store.dispatch(ProductsActions.BeginSetActiveCategoryAction({ payload: activeCategory }));

          this.store.dispatch(ProductsActions.BeginLoadProductsAction({ payload: catsArray }));
          catExists = true;
          resolve(catExists);
        } else if (activeCategory && activeCategory.fields.redirect) {
          this.navService.ctaClick(activeCategory.fields.redirect);
        }
      }
      if (!catExists) {
        this.router.navigate(['/'])
      }
    }).then());
  }
}
