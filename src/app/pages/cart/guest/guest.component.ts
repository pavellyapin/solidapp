import { Component, ChangeDetectorRef } from '@angular/core';
import { Store, select } from '@ngrx/store';
import * as CartActions from 'src/app/services/store/cart/cart.action';
import { NavigationService } from 'src/app/services/navigation/navigation.service';
import SettingsState from 'src/app/services/store/settings/settings.state';
import { Observable, Subscription } from 'rxjs';
import { Entry } from 'contentful';
import { map } from 'rxjs/operators';
import { UtilitiesService } from 'src/app/services/util/util.service';

@Component({
    selector: 'doo-checkout-guest',
    templateUrl: './guest.component.html',
    styleUrls: ['./guest.component.scss',]
  })
  export class GuestCheckoutComponent  {

    settings$: Observable<SettingsState>;
    SettingsSubscription: Subscription;

    loginPageContent: Entry<any>;
    resolution: any;

    constructor(private store: Store<{settings: SettingsState}>,
      private navService:NavigationService,
      public utils : UtilitiesService,
      private changeDetectorRef : ChangeDetectorRef) {
      this.settings$ = store.pipe(select('settings'));
    }

    ngOnInit() {
      this.SettingsSubscription = this.settings$
      .pipe(
        map(x => {
          if (x.pages) {
            this.loginPageContent = x.pages.filter(page => {
              if (page.fields.type == 'login') {
                return page;
              }
            }).pop();
          }
          this.changeDetectorRef.detectChanges();
          this.resolution = x.resolution;
        })
      ).subscribe();
    }

    ngAfterViewInit() {
      this.navService.finishLoading();
    }

    continueGuest() {
      this.store.dispatch(CartActions.SuccessSetGuestFlowAction({ payload: true }));
    }

  }