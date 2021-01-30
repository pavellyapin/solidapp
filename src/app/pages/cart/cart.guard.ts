import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivateChild } from '@angular/router';
import { Store, select } from '@ngrx/store';
import CartState from 'src/app/services/store/cart/cart.state';
import { map } from 'rxjs/operators';
import * as CartActions from '../../services/store/cart/cart.action';
import { Actions, ofType } from '@ngrx/effects';
import { Observable } from 'rxjs';
import { NavigationService } from 'src/app/services/navigation/navigation.service';
import UserState from 'src/app/services/store/user/user.state';
import { AuthService } from 'src/app/services/auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class CheckoutCartGuard implements CanActivateChild {

  cartId: any;
  isGuestFlow: any;
  personalInfo: any;

  constructor(
    private store: Store<{ cart: CartState, user: UserState }>,
    private _actions$: Actions,
    private router: Router,
    public navService: NavigationService) {
    store.pipe(select('user'))
      .pipe(
        map(x => {
          this.personalInfo = x.personalInfo;
        })
      ).subscribe();
    store.pipe(select('cart', 'isGuestFlow'))
      .pipe(
        map(x => {
          this.isGuestFlow = x;
        })
      ).subscribe();

    store.pipe(select('cart', 'cartId'))
      .pipe(
        map(x => {
          this.cartId = x;
        })
      ).subscribe();
  }


  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    this.navService.startLoading();
    return this._actions$.pipe(ofType(CartActions.SuccessGetCartAction)).pipe(map(x => {
      if (x.payload.status == "paid") {
        this.store.dispatch(CartActions.BeginResetCartAction());
        this.router.navigateByUrl('order/success/' + this.cartId);
      } else if (state.url.endsWith('payment')) {
        if (this.cartId && (x.payload.personalInfo && Object.keys(x.payload.personalInfo).length != 0)) {
          return true;
        } else {
          this.router.navigate(['cart']);
        }
      } else if (state.url.endsWith('shipping')) {
        if (this.isGuestFlow || (this.personalInfo && Object.keys(this.personalInfo).length != 0) || !x.payload.cart.cart) {
          return true;
        } else {
          this.router.navigate(['cart']);
        }
      } else {
        if (this.isGuestFlow || (this.personalInfo && Object.keys(this.personalInfo).length != 0) || !x.payload.cart.cart) {
          this.router.navigate(['cart/checkout/' + this.cartId + '/shipping']);
        } else {
          return true;
        }
      }
    }));
  }
}
