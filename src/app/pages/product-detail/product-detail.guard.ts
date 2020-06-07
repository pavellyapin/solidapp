import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot} from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Entry } from 'contentful';
import { Store } from '@ngrx/store';
import { ContentfulService } from '../../services/contentful/contentful.service';
import * as ProductsActions from '../../services/store/product/product.action';
import SettingsState from 'src/app/services/store/settings/settings.state';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root',
})
export class ProductDetailGuard implements CanActivate  {

  categories$: Observable<Entry<any>[]>;
  categories: Entry<any>[];
  
  constructor(private router: Router , 
              public afAuth: AngularFireAuth,
              private contentful: ContentfulService , 
              private store: Store<{settings: SettingsState}>) {
      this.categories$ = store.select('settings','categories');
      this.categories$.pipe(
        map(x => {
          this.categories = x;
        }
      )).subscribe();
  }


  canActivate(route: ActivatedRouteSnapshot) : Observable<boolean> {
    return this.contentful.getProductDetails(route.params["product"]).pipe(
      map(x => {
        this.store.dispatch(ProductsActions.BeginLoadProductReviewsAction({payload : x.sys.id}));
          if (x) {
            if(x.fields.categories) {
              this.categories.forEach(function(category) {
                if(category.fields.name == x.fields.categories[0].fields.name) {
                  this.store.dispatch(ProductsActions.SuccessLoadProductsAction({payload : []}));
                  this.store.dispatch(ProductsActions.BeginSetActiveCategoryAction({payload : category}));
                  this.store.dispatch(ProductsActions.BeginLoadProductsAction({payload : category.sys.id}));
                }
              }.bind(this));
            }
            this.store.dispatch(ProductsActions.BeginLoadProductDetailsAction({payload : x}));
            return true;
          } else {
            this.router.navigate(['/']);
          }
        }
      ) 
    )
  }
}
