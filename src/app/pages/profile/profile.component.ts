import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import * as UserActions from 'src/app/services/store/user/user.action';
import * as CartActions from 'src/app/services/store/cart/cart.action';
import { NavigationService } from 'src/app/services/navigation/navigation.service';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  
  constructor(private router: Router,
              private store: Store<{}>,
              private navService : NavigationService) {
                
  }

  ngOnInit() {
    this.navService.resetStack(['account/profile']);
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
