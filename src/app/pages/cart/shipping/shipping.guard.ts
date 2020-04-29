import { Injectable } from '@angular/core';
import { CanActivate, Router} from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import CartState from 'src/app/services/store/cart/cart.state';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root',
})
export class CheckoutShippingGuard implements CanActivate  {

  cartId$: Observable<string>;
  cartId: string;
  
  constructor(private router: Router , 
              store: Store<{cart: CartState}>,
              public afAuth: AngularFireAuth) {
      this.cartId$ = store.select('cart','cartId');
      this.cartId$.pipe(
        map(x => {
          this.cartId = x;
        }
      )).subscribe();
  }


  canActivate() : Observable<boolean> | boolean {
    if (this.cartId) {
        return true
    } else {
        this.router.navigate(['cart']);
    }
  }
}
