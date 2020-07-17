import { Injectable } from '@angular/core';
import { CanActivate, Router} from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';
import CartState from 'src/app/services/store/cart/cart.state';
import UserState from 'src/app/services/store/user/user.state';

@Injectable({
  providedIn: 'root',
})
export class GuestCheckoutGuard implements CanActivate {
  cartId:any;
  user$: Observable<any>;
  constructor(private router: Router,
              store: Store<{ cart: CartState , user: UserState }>) {
                
    store.pipe(select('cart' , 'cartId'))
    .pipe(
      map(x => {
        this.cartId = x;
      })
    )
    .subscribe();
    this.user$ = store.pipe(select('user' , 'personalInfo'));

  }

  canActivate(): Observable<boolean> {

    return this.user$
    .pipe(
      map(x => {
        if (x && Object.keys(x).length !=0) {
            this.router.navigate(['cart/checkout/' + this.cartId + '/shipping']);
        }
        return true;
      })
    );
  }
}
