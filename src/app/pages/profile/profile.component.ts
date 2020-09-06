import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Store, select } from '@ngrx/store';
import * as UserActions from 'src/app/services/store/user/user.action';
import * as CartActions from 'src/app/services/store/cart/cart.action';
import { NavigationService } from 'src/app/services/navigation/navigation.service';
import SettingsState from 'src/app/services/store/settings/settings.state';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { Actions, ofType } from '@ngrx/effects';
import UserState from 'src/app/services/store/user/user.state';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {

  settings$: Observable<SettingsState>;
  SettingsSubscription: Subscription;
  userInfoUpdate$: Subscription;

  user$: Observable<UserState>;
  UserSubscription: Subscription;
  
  resolution : any;
  navMode : any;
  bigScreens = new Array('lg' , 'xl' , 'md')
  filtersOpen : boolean;
  showToggle : boolean = true;
  loading : boolean = false;
  
  constructor(private router: Router,
              private store: Store<{settings : SettingsState , user : UserState}>,
              private _actions$: Actions,
              private navService : NavigationService,
              private changeDetectorRef: ChangeDetectorRef,
              private authState: AuthService) {
                this.settings$ = store.pipe(select('settings'));
                this.user$ = store.pipe(select('user'));
  }

  ngOnInit() {
    //For mobile devices we are using redirect login, so need to see if
    //user is already logged in but state has not been inisialized yet
    this.UserSubscription = this.user$
    .pipe(
      map(x => {
        if(this.authState.uid && !x.uid) {
            this.store.dispatch(UserActions.BeginGetRedirectResultAction());
        }
      })
    )
    .subscribe();

     
    this.SettingsSubscription = this.settings$
    .pipe(
      map(x => {
        this.loading = x.loading;
        this.changeDetectorRef.detectChanges();
        this.resolution = x.resolution;
        if (this.bigScreens.includes(this.resolution)) {
          this.navMode = 'side';
          this.filtersOpen = true;
        } else {
          this.navMode = 'over';
          this.filtersOpen = false;
        }
        
      })
    )
    .subscribe();

    if (this.navService.getActivePage().title == 'Profile Overview') {
      this.showToggle = false;
    }

    this.router.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
        if(val.url == '/account/overview') {
          this.showToggle = false;
        } else {
          this.showToggle = true;
        }
        this.navService.finishLoading();
      }
  });

    this.userInfoUpdate$ = this._actions$.pipe(ofType(
      UserActions.SuccessGetUserInfoAction,
      UserActions.SuccessGetUserAddressInfoAction)).subscribe(() => {
        this.navService.finishLoading();    
      });

    this.navService.resetStack(['account/overview']);
    this.store.dispatch(UserActions.BeginGetUserAddressInfoAction());
    this.store.dispatch(UserActions.BeginGetFavoritesAction());
    this.store.dispatch(UserActions.BeginGetOrdersAction());
    this.navService.finishLoading();
  }

  public async logout() {
    this.navService.startLoading();
    this.store.dispatch(UserActions.BeginUserLogoutAction());
    this.store.dispatch(CartActions.BeginResetCartAction());
    this.router.navigate(['']);
  }

  navigateToApp(type){
    if (this.navMode == 'over') {
      this.filtersOpen = false;
    }
    switch(type) {
      case 'overview':
        this.router.navigateByUrl('account/overview');
        break;
      case 'profile':
        this.router.navigateByUrl('account/profile');
        break;
      case 'addressinfo':
        this.router.navigateByUrl('account/addressinfo');
        break;
      case 'favorites':
        this.router.navigateByUrl('account/favorites');
        break;
      case 'orders':
        this.router.navigateByUrl('account/orders');
        break;
      default :
      
    }
  }

  ngOnDestroy(): void {
    this.SettingsSubscription.unsubscribe();
    this.userInfoUpdate$.unsubscribe();
    this.UserSubscription.unsubscribe();
  }

}
