import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { NavigationService } from 'src/app/services/navigation/navigation.service';
import { Observable, Subscription } from 'rxjs';
import { Store, select } from '@ngrx/store';
import SettingsState from 'src/app/services/store/settings/settings.state';
import { ActivatedRoute, Router } from '@angular/router';
import * as AdminActions from 'src/app/services/store/admin/admin.action';
import { ofType, Actions } from '@ngrx/effects';
import { UtilitiesService } from 'src/app/services/util/util.service';
import { KeyValue } from '@angular/common';

@Component({
  selector: 'app-dashboard-customer-details',
  templateUrl: './customer-details.component.html',
  styleUrls: ['./customer-details.component.scss']
})
export class DashboardCustomerDetailsComponent implements OnInit {


  settings$: Observable<SettingsState>;
  CustomerSubscription: Subscription;

  customerDetails: any;
  displayedOrder: number = 0;
  activeDates: any;

  constructor(private store: Store<{ settings: SettingsState }>,
    private navSerivce: NavigationService,
    private _actions$: Actions,
    public util: UtilitiesService,
    private router: Router,
    private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.store.dispatch(AdminActions.
      BeginLoadCustomerDetailsAction({ payload: this.route.snapshot.params["uid"] }));
    this.CustomerSubscription = this._actions$.pipe(ofType(AdminActions.SuccessLoadCustomerDetailsAction)).subscribe((result) => {
      this.customerDetails = result.payload;
      const dates = new Map<String, Array<any>>();
      this.customerDetails.orders.slice()
        .forEach((order) => {
          const orderDate = new Date(parseInt(order.date, 10));
          const dateString = orderDate.getMonth() + " " + orderDate.getDate() + "," + orderDate.getFullYear();
        if (dates.get(dateString)) {
          dates.get(dateString).push(order)
        } else {
          dates.set(dateString, [order]);
        }
        });
        this.activeDates = new Map([...dates.entries()]);
        this.navSerivce.finishLoading();
    })
  }

 keyDescOrder (a: KeyValue<number,string>, b: KeyValue<number,string>): number {
    return a.key > b.key ? 1 : (b.key > a.key ? -1 : 0);
  }

  goToCustomerOrders() {
    this.navSerivce.startLoading();
    this.router.navigateByUrl('store/orders/' + this.route.snapshot.params["uid"])

  }

  ngOnDestroy(): void {
    this.CustomerSubscription.unsubscribe();
  }

}
