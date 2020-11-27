import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import * as UserActions from 'src/app/services/store/user/user.action';
import { NavigationService } from 'src/app/services/navigation/navigation.service';

@Component({
    selector: 'doo-checkout-guest',
    templateUrl: './guest.component.html',
    styleUrls: ['./guest.component.scss',]
  })
  export class GuestCheckoutComponent  {

    constructor(private store: Store<{}>,private navService:NavigationService) {

    }

    ngAfterViewInit() {
      this.navService.finishLoading();
    }

    continueGuest($event) {
      this.store.dispatch(UserActions.SuccessGetUserInfoAction({ payload: $event }));
    }

  }