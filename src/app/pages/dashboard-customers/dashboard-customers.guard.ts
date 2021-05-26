import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateChild, RouterStateSnapshot, UrlTree, Router, CanActivate, } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/auth';
import { UtilitiesService } from 'src/app/services/util/util.service';
import { Store } from '@ngrx/store';
import * as AdminActions from 'src/app/services/store/admin/admin.action';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DashboardCustomersGuard implements CanActivate, CanActivateChild {

  constructor(public afAuth: AngularFireAuth,
    private utils: UtilitiesService,
    private store: Store<{}>) {
  }

  canActivate(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    this.store.dispatch(AdminActions.BeginLoadCustomersAction());

    return this.afAuth.authState.pipe(map((auth) => {
      this.utils.scrollTop();
      return true;
    }));

  }

  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    return this.afAuth.authState.pipe(map((auth) => {
      this.utils.scrollTop();
      return true;
    }));
  }
}
