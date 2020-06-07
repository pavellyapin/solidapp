import { Injectable } from '@angular/core';
import { CanActivate , ActivatedRouteSnapshot} from '@angular/router';
import { Observable, from } from 'rxjs';
import { Store } from '@ngrx/store';
import * as ProductsActions from 'src/app/services/store/product/product.action';

@Injectable({
  providedIn: 'root',
})
export class SearchGuard implements CanActivate  {

  
  constructor(private store: Store<{}>) {
    
  }


  canActivate(route: ActivatedRouteSnapshot) : Observable<boolean> {
    return from( new Promise<any>((resolve, reject) => {
      this.store.dispatch(ProductsActions.BeginSearchProductsAction({payload : route.params['key']}));
      resolve(true);
    }));
  }
}
