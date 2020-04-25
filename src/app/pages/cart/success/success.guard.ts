import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot} from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import CartState from 'src/app/services/store/cart/cart.state';
import * as CartActions from '../../../services/store/cart/cart.action';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root',
})
export class CheckoutSuccessGuard implements CanActivate  {

  cartId$: Observable<string>;
  cartId: string;
  authReady: boolean = false;
  
  constructor(private router: Router , 
              private store: Store<{cart: CartState}>,
              public afAuth: AngularFireAuth) {
      this.cartId$ = store.select('cart','cartId');
      this.cartId$.pipe(
        map(x => {
          this.cartId = x;
        }
      )).subscribe();
  }


  canActivate(route: ActivatedRouteSnapshot) : Observable<boolean> | boolean {
    if (this.cartId == route.params["order"]) {
      return this.afAuth.authState.pipe(map((auth)=> {
        this.store.dispatch(CartActions.BeginResetCartAction());
        return true
      }));
    } else {
        this.router.navigate(['cart']);
    }
  }
}
