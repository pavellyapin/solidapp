import { Injectable } from '@angular/core';
import { CanActivate, CanDeactivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivateChild, } from '@angular/router';
import { Observable, from, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';
import UserState from 'src/app/services/store/user/user.state';
import * as CartActions from '../../services/store/cart/cart.action';
import CartState from 'src/app/services/store/cart/cart.state';
import { Actions, ofType } from '@ngrx/effects';
import { AuthService } from 'src/app/services/auth/auth.service';
import { NavigationService } from 'src/app/services/navigation/navigation.service';

@Injectable({
  providedIn: 'root',
})
export class CartAuthGuard implements CanActivate,CanActivateChild,CanDeactivate<any> {

  cartId: any;
  isGuestFlow: any;
  personalInfo: any;
  InitSubscription: Subscription;

  constructor(public authService: AuthService, private _actions$: Actions, private router: Router,
    private store: Store<{ user: UserState, cart: CartState }>,public navService: NavigationService) {
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

  canActivate():
    Promise<any> | Observable<any> {
    this.InitSubscription = this._actions$.pipe(ofType(CartActions.SuccessBackGroundInitializeOrderAction)).pipe(map(x => {
      if (this.authService.isRedirect) {
        this.authService.isRedirect = false;
      }
      this.store.dispatch(CartActions.BeginGetCartAction({ payload: x.payload }));
      this.router.navigateByUrl('cart/checkout/' + this.cartId + '/shipping');
    })).subscribe();



    if (!this.authService.isRedirect) {
      return from(new Promise<any>((resolve, reject) => {
        this.authService.afAuth.currentUser
          .then(auth => {
            if (this.cartId && !this.authService.isRedirect) {
              this.store.dispatch(CartActions.BeginGetCartAction({ payload: this.cartId }));
            }
            resolve(true);
          }, err => reject(err));
      }));
    }
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    this.navService.startLoading();
    
    return this._actions$.pipe(ofType(CartActions.SuccessGetCartAction)).pipe(map(x => {
      if (x.payload.status == "paid") {
        this.InitSubscription.unsubscribe();
        this.store.dispatch(CartActions.BeginResetCartAction());
        this.router.navigateByUrl('order/success/' + this.cartId);
      } else if (state.url.endsWith('payment')) {
        if (this.cartId && (x.payload.personalInfo && Object.keys(x.payload.personalInfo).length != 0)) {
          return true;
        } else {
          this.InitSubscription.unsubscribe();
          this.router.navigate(['cart']);
        }
      } else if (state.url.endsWith('shipping')) {
        if (this.isGuestFlow || (this.personalInfo && Object.keys(this.personalInfo).length != 0) || !x.payload.cart.cart) {
          return true;
        } else {
          this.InitSubscription.unsubscribe();
          this.router.navigate(['cart']);
        }
      } else {
        if (this.isGuestFlow || (this.personalInfo && Object.keys(this.personalInfo).length != 0) || !x.payload.cart.cart) {
          this.InitSubscription.unsubscribe();
          this.router.navigateByUrl('cart/checkout/' + this.cartId + '/shipping');
        } else {
          return true;
        }
      }
    }));
  }

  canDeactivate() {
    this.InitSubscription.unsubscribe();
    return true;
  }
}
