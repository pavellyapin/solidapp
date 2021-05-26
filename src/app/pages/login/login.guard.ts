import { Injectable } from '@angular/core';
import { CanActivate, Router, CanDeactivate } from '@angular/router';
import { Observable, from, Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Actions, ofType } from '@ngrx/effects';
import * as CartActions from '../../services/store/cart/cart.action';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class LoginGuard implements CanActivate,CanDeactivate<any> {

  InitSubscription: Subscription;

  constructor(
    public authService: AuthService,
    private _actions$: Actions,
    private router: Router) {
  }

  canActivate():
    Promise<any> | Observable<any> {
      
    this.InitSubscription = this._actions$.pipe(ofType(CartActions.SuccessBackGroundInitializeOrderAction)).pipe(map(x => {
      this.authService.isRedirect = false;
      this.router.navigate(['account/overview']);
    })).subscribe();

    return from(new Promise<any>((resolve, reject) => {
      this.authService.afAuth.currentUser
        .then(auth => {
          if (this.authService.isRedirect) {
            this.authService.isRedirect = false;
          }
          if (auth && !auth.isAnonymous) {
            this.InitSubscription.unsubscribe();
            this.router.navigate(['account/overview']);
          }
          resolve(true);
        }, err => reject(err));
    }));
  }


  canDeactivate() {
    this.InitSubscription.unsubscribe();
    return true;
  }
}
