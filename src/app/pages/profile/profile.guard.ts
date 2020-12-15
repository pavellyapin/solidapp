import { Injectable } from '@angular/core';
import { CanActivate} from '@angular/router';
import { Store, select } from '@ngrx/store';
import UserState from 'src/app/services/store/user/user.state';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserPermissions } from 'src/app/services/store/user/user.model';
import { AuthService } from 'src/app/services/auth/auth.service';
import * as UserActions from 'src/app/services/store/user/user.action';

@Injectable({
  providedIn: 'root',
})
export class ProfileGuard implements CanActivate  {
  
  userPermissions$: Observable<UserState>;
  permissions : UserPermissions;
  
  constructor(private store: Store<{user : UserState}>,private authState: AuthService,) {
    this.userPermissions$ = store.pipe(select('user'));

   this.userPermissions$
    .pipe(
      map((x: any) => {
        if (x.permissions) {
          this.permissions = x;
        }
        if(this.authState.uid && !x.uid) {
          this.store.dispatch(UserActions.BeginGetRedirectResultAction());
        }
      })
    ).subscribe();
  }


  canActivate() : Observable<boolean> | boolean {
    if (this.permissions && this.permissions.enableStore) {
      this.store.dispatch(UserActions.BeginGetSiteInfoAction());
    }
    this.store.dispatch(UserActions.BeginGetUserAddressInfoAction());
    this.store.dispatch(UserActions.BeginGetFavoritesAction());
    this.store.dispatch(UserActions.BeginGetOrdersAction());
    return true;
  }
}
