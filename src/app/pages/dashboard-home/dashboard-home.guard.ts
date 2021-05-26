import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivateChild, RouterStateSnapshot, UrlTree, Router, CanActivate, CanDeactivate,} from '@angular/router';
import {Observable, Subscription} from 'rxjs';
import { map } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/auth';
import { UtilitiesService } from 'src/app/services/util/util.service';
import { Store, select } from '@ngrx/store';
import * as AdminActions from 'src/app/services/store/admin/admin.action';
import { environment } from 'src/environments/environment';
import UserState from 'src/app/services/store/user/user.state';
import { UserPermissions } from 'src/app/services/store/user/user.model';
import { NavigationService } from 'src/app/services/navigation/navigation.service';

@Injectable({
  providedIn: 'root',
})
export class DashboardHomeGuard implements CanActivate , CanDeactivate<any>{

  user$: Observable<UserPermissions>;
  UserSubscription: Subscription;
  permissions: UserPermissions;
  
  constructor(public afAuth: AngularFireAuth,
              private utils : UtilitiesService,
              private store: Store<{user: UserState }>,
              private router: Router,
              public navService: NavigationService) {
                
                this.user$ = store.pipe(select('user', 'permissions'));
                this.UserSubscription = this.user$
                .pipe(
                  map(x => {
                    this.permissions = x;
                  })
                )
                .subscribe();
  }

  canActivate(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
      return this.afAuth.authState.pipe(map((auth)=> {
        if (this.permissions && this.permissions.enableStore) {
          this.navService.startLoading();
          this.utils.scrollTop();
          this.store.dispatch(AdminActions.BeginLoadNewOrdersAction());
          this.store.dispatch(AdminActions.BeginStatsPerPeriodAction({payload : {quickLook:"today"}}));
          return true;
        } else {
          this.router.navigate(['/']);
        }
      }));
  }

  canDeactivate() {
    this.store.dispatch(AdminActions.SuccessResetDashboardHomeAction());
    return true;
  }
}
