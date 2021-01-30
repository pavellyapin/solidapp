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
import { MatDialog } from '@angular/material/dialog';
import { ConfirmFullfillOrderModalComponent } from '../modals/confirm-fullfill/confirm-fulfill.component';
import { UtilitiesService } from 'src/app/services/util/util.service';
import { KeyValue } from '@angular/common';
import { ConfirmUnFullfillOrderModalComponent } from '../modals/confirm-unfullfill/confirm-unfulfill.component';

@Component({
  selector: 'app-dashboard-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.scss']
})
export class DashboardOrderDetailsComponent implements OnInit {


  OrderSubscription: Subscription;
  FulfillSubscription: Subscription;
  SettingsSubscription: Subscription;
  settings$: Observable<SettingsState>;
  resolution: any;

  order: any;
  siteSettings: any;
  activeDates: any;

  constructor(private store: Store<{ settings: SettingsState }>,
    private navSerivce: NavigationService,
    private _actions$: Actions,
    private dialog: MatDialog,
    private utilService: UtilitiesService,
    public route: ActivatedRoute) {

    this.settings$ = store.pipe(select('settings'));
  }

  ngOnInit() {

    this.SettingsSubscription = this.settings$
      .pipe(
        map(x => {
          this.siteSettings = x.siteConfig;
          this.resolution = x.resolution;
        })
      )
      .subscribe();

    this.store.dispatch(AdminActions.
      BeginLoadOrderDetailsAction({ payload: { "uid": this.route.snapshot.params["uid"], "orderId": this.route.snapshot.params["orderId"] } }));
    this.OrderSubscription = this._actions$.pipe(ofType(AdminActions.SuccessLoadOrderDetailsAction)).subscribe((result) => {
      this.order = result.payload;
      const dates = new Map<String, Array<any>>();
      const orderDate = new Date(parseInt(this.order.order.cart.date, 10));
      const dateString = orderDate.getMonth() + " " + orderDate.getDate() + "," + orderDate.getFullYear();
      
      dates.set(dateString, [{action : 'created' , date : this.order.order.cart.date}]);
      dates.get(dateString).push({action : 'paid' , date : this.order.order.cart.date});

      if(this.order.fullfilment && this.order.fullfilment.status) {
        const fullfilDate = new Date(parseInt(this.order.fullfilment.updateDate, 10));
        const fillfilDateString = fullfilDate.getMonth() + " " + fullfilDate.getDate() + "," + fullfilDate.getFullYear();
        if (dates.get(fillfilDateString)) {
          dates.get(fillfilDateString).push({action : 'fullfilled' , date : this.order.fullfilment.updateDate})
        } else {
          dates.set(fillfilDateString, [{action : 'fullfilled' , date : this.order.fullfilment.updateDate}]);
        }
      }
      dates.set(dateString,dates.get(dateString).reverse());   
      this.activeDates = new Map([...dates.entries()]);
      this.navSerivce.finishLoading();
    });
    this.FulfillSubscription = this._actions$.pipe(ofType(AdminActions.SuccessFulfillOrderAction,AdminActions.SuccessUnfulfillOrderAction)).subscribe((result) => {
      this.store.dispatch(AdminActions.
        BeginLoadOrderDetailsAction({ payload: { "uid": this.route.snapshot.params["uid"], "orderId": this.route.snapshot.params["orderId"] } }));
        this.store.dispatch(AdminActions.BeginLoadNewOrdersAction());
    });
  }

  keyDescOrder (a: KeyValue<number,string>, b: KeyValue<number,string>): number {
    return a.key < b.key ? 1 : (b.key < a.key ? -1 : 0);
  }

  confirmFulfillOrder() {
    let config;

    config = {
      position: {
        top: '0px',
        right: '0px'
      },
      height: '100%',
      width: '100vw',
      panelClass: 'full-screen-modal',
      data: { order: this.order }
    };
    const dialogRef = this.dialog.open(ConfirmFullfillOrderModalComponent, config);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.navSerivce.startLoading();
        this.fulfillOrder();
      }
    });
  }

  fulfillOrder() {
    this.store.dispatch(AdminActions.
      BeginFulfillOrderAction({ payload: { "uid": this.route.snapshot.params["uid"], "orderId": this.route.snapshot.params["orderId"] } }));
  }

  confirmUnfulfillOrder() {
    let config;

    config = {
      position: {
        top: '0px',
        right: '0px'
      },
      height: '100%',
      width: '100vw',
      panelClass: 'full-screen-modal',
      data: { order: this.order }
    };
    const dialogRef = this.dialog.open(ConfirmUnFullfillOrderModalComponent, config);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.navSerivce.startLoading();
        this.unfulfillOrder();
      }
    });
  }

  unfulfillOrder() {
    this.store.dispatch(AdminActions.
      BeginUnfulfillOrderAction({ payload: { "uid": this.route.snapshot.params["uid"], "orderId": this.route.snapshot.params["orderId"] } }));
  }

  goToCustomer(id) {
    console.log(id);

  }
  ngOnDestroy(): void {
    this.OrderSubscription.unsubscribe();
    this.SettingsSubscription.unsubscribe();
    this.FulfillSubscription.unsubscribe();
  }

}
