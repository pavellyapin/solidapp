import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import * as UserActions from 'src/app/services/store/user/user.action';
import * as CartActions from 'src/app/services/store/cart/cart.action';
import { NavigationService } from 'src/app/services/navigation/navigation.service';
import SettingsState from 'src/app/services/store/settings/settings.state';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { Actions, ofType } from '@ngrx/effects';
import UserState from 'src/app/services/store/user/user.state';
import { UtilitiesService } from 'src/app/services/util/util.service';
import { SEOService } from 'src/app/services/seo/seo.service';
import { Entry } from 'contentful';
import { UserPermissions } from 'src/app/services/store/user/user.model';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {

  settings$: Observable<SettingsState>;
  profilePageContent: Entry<any>;
  SettingsSubscription: Subscription;
  userInfoUpdate$: Subscription;

  user$: Observable<UserPermissions>;
  UserSubscription: Subscription;
  permissions: UserPermissions;

  resolution: any;
  navMode: any;
  filtersOpen: boolean;
  loading: boolean = false;

  constructor(private router: Router,
    private store: Store<{ settings: SettingsState, user: UserState }>,
    private _actions$: Actions,
    private navService: NavigationService,
    private changeDetectorRef: ChangeDetectorRef,
    public utils: UtilitiesService,
    private seoService: SEOService) {
    this.settings$ = store.pipe(select('settings'));
    this.user$ = store.pipe(select('user', 'permissions'));
  }

  ngOnInit() {
    //For mobile devices we are using redirect login, so need to see if
    //user is already logged in but state has not been inisialized yet
    this.UserSubscription = this.user$
      .pipe(
        map(x => {
          this.permissions = x;
        })
      )
      .subscribe();


    this.SettingsSubscription = this.settings$
      .pipe(
        map(x => {
          this.loading = x.loading;
          this.changeDetectorRef.detectChanges();
          this.resolution = x.resolution;
          this.profilePageContent = x.pages.filter(page => {
            if (page.fields.type == 'profile') {
              this.seoService.updateTitle(page.fields.title);
              this.seoService.updateDescription(page.fields.description);
              this.seoService.updateOgUrl(window.location.href);
              return page;
            }
          }).pop();
          if (this.utils.bigScreens.includes(this.resolution)) {
            this.navMode = 'side';
            this.filtersOpen = true;
          } else {
            this.navMode = 'over';
            this.filtersOpen = false;
          }

        })
      )
      .subscribe();


    this.userInfoUpdate$ = this._actions$.pipe(ofType(
      UserActions.SuccessGetUserInfoAction,
      UserActions.SuccessGetUserAddressInfoAction)).subscribe(() => {
        this.navService.finishLoading();
      });

    this.navService.resetStack(['account/overview']);

    this.navService.finishLoading();
  }

  public async logout() {
    this.navService.startLoading();
    this.store.dispatch(UserActions.BeginUserLogoutAction());
    this.router.navigate(['']);
  }

  navigateToApp(type) {
    if (this.navMode == 'over') {
      this.filtersOpen = false;
    }
    switch (type) {
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
      case 'store':
        this.router.navigateByUrl('store/overview');
        break;
      default:

    }
  }

  ngOnDestroy(): void {
    this.SettingsSubscription.unsubscribe();
    this.userInfoUpdate$.unsubscribe();
    this.UserSubscription.unsubscribe();
  }

}
