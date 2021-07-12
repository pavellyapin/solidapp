import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanActivate, CanActivateChild,} from '@angular/router';
import {Observable} from 'rxjs';
import { map } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/auth';
import { UtilitiesService } from 'src/app/services/util/util.service';
import { Store } from '@ngrx/store';
import * as AdminActions from 'src/app/services/store/admin/admin.action';

@Injectable({
  providedIn: 'root',
})
export class DashboardSubscriptionsGuard implements CanActivate , CanActivateChild {
  
  constructor(public afAuth: AngularFireAuth,
              private utils : UtilitiesService,
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
      this.store.dispatch(AdminActions.BeginLoadSubscriptionsAction());

      return this.afAuth.authState.pipe(map((auth)=> {
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
