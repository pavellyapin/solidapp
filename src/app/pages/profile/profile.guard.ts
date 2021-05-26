import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import UserState from 'src/app/services/store/user/user.state';
import { Observable, from } from 'rxjs';
import { UserPermissions } from 'src/app/services/store/user/user.model';
import { AuthService } from 'src/app/services/auth/auth.service';
import * as UserActions from 'src/app/services/store/user/user.action';

@Injectable({
  providedIn: 'root',
})
export class ProfileGuard implements CanActivate {

  userPermissions$: Observable<UserState>;
  permissions: UserPermissions;

  constructor(
    private store: Store<{}>,
    public authService: AuthService,
    private router: Router) {
  }

  canActivate():
    Promise<any> | Observable<any> {
    return from(new Promise<any>((resolve, reject) => {
      this.authService.afAuth.currentUser
        .then(auth => {
          if (!auth || auth.isAnonymous) {
            this.router.navigate(['login']);
          } else {
            this.store.dispatch(UserActions.BeginGetUserAddressInfoAction());
            this.store.dispatch(UserActions.BeginGetFavoritesAction());
            this.store.dispatch(UserActions.BeginGetOrdersAction());
          }
          resolve(true);
        }, err => reject(err));
    }));
  }
}
