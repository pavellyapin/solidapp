import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import * as UserActions from 'src/app/services/store/user/user.action';
import * as CartActions from 'src/app/services/store/cart/cart.action';
import { NavigationService } from 'src/app/services/navigation/navigation.service';
import SettingsState from 'src/app/services/store/settings/settings.state';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {

  settings$: Observable<String>;
  SettingsSubscription: Subscription;
  resolution : any;
  navMode : any;
  bigScreens = new Array('lg' , 'xl' , 'md')
  filtersOpen : boolean;
  
  constructor(private router: Router,
              private store: Store<{settings : SettingsState}>,
              private navService : NavigationService) {
                this.settings$ = store.pipe(select('settings' ,'resolution'));
  }

  ngOnInit() {
    this.SettingsSubscription = this.settings$
    .pipe(
      map(x => {
        this.resolution = x;
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

    this.navService.resetStack(['account/overview']);
    this.store.dispatch(UserActions.BeginGetUserAddressInfoAction());
    this.store.dispatch(UserActions.BeginGetFavoritesAction());
    this.store.dispatch(UserActions.BeginGetOrdersAction());
  }

  ngAfterViewInit() {
    this.navService.finishLoading();
  }
  

  public async logout() {
    this.store.dispatch(UserActions.BeginUserLogoutAction());
    this.store.dispatch(CartActions.BeginResetCartAction());
    this.router.navigate(['']);
  }

  public navigateTo(url?: string) {
    url = url || 'nav';
    this.router.navigate([url], { replaceUrl: true });
  }
}
