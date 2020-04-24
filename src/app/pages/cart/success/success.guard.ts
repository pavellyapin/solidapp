import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot} from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import CartState from 'src/app/services/store/cart/cart.state';
import * as CartActions from '../../../services/store/cart/cart.action';

@Injectable({
  providedIn: 'root',
})
export class CheckoutSuccessGuard implements CanActivate  {

  cartId$: Observable<string>;
  cartId: string;
  
  constructor(private router: Router , 
              private store: Store<{cart: CartState}>) {
      this.cartId$ = store.select('cart','cartId');
      this.cartId$.pipe(
        map(x => {
          this.cartId = x;
        }
      )).subscribe();
  }


  canActivate(route: ActivatedRouteSnapshot) : boolean {
    if (this.cartId == route.params["order"]) {
        //this.store.dispatch(CartActions.BeginResetCartAction());
        this.store.dispatch(CartActions.BeginGetCartAction({ payload : this.cartId}));
        return true;
    } else {
        this.router.navigate(['cart']);
    }
  }
}
