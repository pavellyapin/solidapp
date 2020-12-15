import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { NavigationService } from 'src/app/services/navigation/navigation.service';
import { Observable, Subscription } from 'rxjs';
import { Store, select } from '@ngrx/store';
import SettingsState from 'src/app/services/store/settings/settings.state';
import { ActivatedRoute } from '@angular/router';
import * as AdminActions from 'src/app/services/store/admin/admin.action';
import { ofType, Actions } from '@ngrx/effects';
import { Entry } from 'contentful';

@Component({
  selector: 'app-dashboard-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.scss']
})
export class DashboardOrderDetailsComponent implements OnInit {


  OrderSubscription: Subscription;
  SettingsSubscription: Subscription;
  settings$: Observable<Entry<any>>;

  cart: any;
  siteSettings :any;

  constructor(private store: Store<{settings : SettingsState }> ,
              private navSerivce : NavigationService,
              private _actions$: Actions,
              public route: ActivatedRoute) {
                
                this.settings$ = store.pipe(select('settings','siteConfig'));
  }

  ngOnInit() {
    
    this.SettingsSubscription = this.settings$
    .pipe(
      map(x => {
        this.siteSettings = x;
      })
    )
    .subscribe();

    this.store.dispatch(AdminActions.
      BeginLoadOrderDetailsAction({payload : {"uid" : this.route.snapshot.params["uid"],"orderId" : this.route.snapshot.params["orderId"]}}));
      this.OrderSubscription = this._actions$.pipe(ofType(AdminActions.SuccessLoadOrderDetailsAction)).subscribe((result) => {
        this.cart = result.payload.order;
        this.navSerivce.finishLoading();
      })
  }

  goToCustomer(id) {
    console.log(id);
    
  }
  ngOnDestroy(): void {
    this.OrderSubscription.unsubscribe();
    this.SettingsSubscription.unsubscribe();
  }

}
