import { Injectable } from '@angular/core';
import { CanActivate, CanDeactivate, } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/auth';
import { Store, select } from '@ngrx/store';
import UserState from 'src/app/services/store/user/user.state';
import * as UserActions from '../../services/store/user/user.action';
import * as CartActions from '../../services/store/cart/cart.action';
import CartState from 'src/app/services/store/cart/cart.state';

@Injectable({
  providedIn: 'root',
})
export class CartAuthGuard implements CanActivate, CanDeactivate<any> {

  uid: any;
  cartId: any;
  private subscription: Subscription;

  constructor(public afAuth: AngularFireAuth,
    private store: Store<{ user: UserState, cart: CartState }>) {
    store.pipe(select('user', 'uid'))
      .pipe(
        map(x => {
          this.uid = x;
        })
      ).subscribe();

    store.pipe(select('cart', 'cartId'))
      .pipe(
        map(x => {
          this.cartId = x;
        })
      ).subscribe();
  }

  canActivate():
    Promise<any> | Observable<any> {
    return new Promise((res) => {
      this.subscription = this.afAuth.authState.pipe(map((auth) => {
        if ((auth.uid && !auth.isAnonymous) && !this.uid) {
          this.store.dispatch(UserActions.BeginGetRedirectResultAction());
        } else {
          this.store.dispatch(CartActions.BeginGetCartAction({ payload: this.cartId }));
        }
        return true;
      })).subscribe({
        next: () => res(true)
      });
    });
  }

  canDeactivate() {
    this.subscription.unsubscribe();
    return true;
  }
}
