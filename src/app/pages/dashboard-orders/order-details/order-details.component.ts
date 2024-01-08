import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { NavigationService } from 'src/app/services/navigation/navigation.service';
import { Observable, Subscription } from 'rxjs';
import { Store, select } from '@ngrx/store';
import SettingsState from 'src/app/services/store/settings/settings.state';
import { ActivatedRoute, Router } from '@angular/router';
import * as AdminActions from 'src/app/services/store/admin/admin.action';
import { ofType, Actions } from '@ngrx/effects';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmFullfillOrderModalComponent } from '../modals/confirm-fullfill/confirm-fulfill.component';
import { UtilitiesService } from 'src/app/services/util/util.service';
import { KeyValue } from '@angular/common';
import { ConfirmUnFullfillOrderModalComponent } from '../modals/confirm-unfullfill/confirm-unfulfill.component';
import { ConfirmDeliverOrderModalComponent } from '../modals/confirm-deliver/confirm-deliver.component';
import { ConfirmUndeliverOrderModalComponent } from '../modals/confirm-undeliver/confirm-undeliver.component';

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
    private navService: NavigationService,
    private _actions$: Actions,
    private dialog: MatDialog,
    private utilService: UtilitiesService,
    public route: ActivatedRoute,
    private router: Router) {

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
      const dateString = orderDate.getMonth() + orderDate.getDate().toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false}) + orderDate.getFullYear();


      dates.set(dateString, [{ action: 'created', date: this.order.order.cart.date }]);
      dates.get(dateString).push({ action: 'paid', date: this.order.order.cart.date });

      if (this.order.fullfilment && this.order.fullfilment.status) {
        const fullfilDate = new Date(parseInt(this.order.fullfilment.updateDate, 10));
        const fillfilDateString = fullfilDate.getMonth() + fullfilDate.getDate().toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false}) + fullfilDate.getFullYear();
        if (dates.get(fillfilDateString)) {
          dates.get(fillfilDateString).push({ action: 'fullfilled', date: this.order.fullfilment.updateDate })
        } else {
          dates.set(fillfilDateString, [{ action: 'fullfilled', date: this.order.fullfilment.updateDate }]);
        }
      }

      if (this.order.delivery && this.order.delivery.status) {
        const deliveryDate = new Date(parseInt(this.order.delivery.updateDate, 10));
        const deliveryDateString = deliveryDate.getMonth() + deliveryDate.getDate().toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false}) + deliveryDate.getFullYear();
        if (dates.get(deliveryDateString)) {
          dates.get(deliveryDateString).push({ action: 'delivered', date: this.order.delivery.updateDate })
        } else {
          dates.set(deliveryDateString, [{ action: 'delivered', date: this.order.delivery.updateDate }]);
        }
      }

      dates.set(dateString, dates.get(dateString).reverse());
      this.activeDates = new Map([...dates.entries()]);
      this.navService.finishLoading();
    });
    this.FulfillSubscription = this._actions$.
      pipe(ofType(AdminActions.SuccessFulfillOrderAction,
        AdminActions.SuccessUnfulfillOrderAction,
        AdminActions.SuccessDeliverOrderAction,
        AdminActions.SuccessUndeliverOrderAction)).subscribe((result) => {
          this.store.dispatch(AdminActions.
            BeginLoadOrderDetailsAction({ payload: { "uid": this.route.snapshot.params["uid"], "orderId": this.route.snapshot.params["orderId"] } }));
          this.store.dispatch(AdminActions.BeginLoadNewOrdersAction());
        });
  }

  keyDescOrder(a: KeyValue<string, [any]>, b: KeyValue<string, [any]>): number {
    return parseInt(a.key) < parseInt(b.key) ? 1 :
      (parseInt(b.key) < parseInt(a.key) ? -1 : 0);
  }

  confirmDeliverOrder() {
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
    const dialogRef = this.dialog.open(ConfirmDeliverOrderModalComponent, config);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.navService.startLoading();
        this.deliverOrder();
      }
    });
  }

  deliverOrder() {
    this.store.dispatch(AdminActions.
      BeginDeliverOrderAction({ payload: { "uid": this.route.snapshot.params["uid"], "orderId": this.route.snapshot.params["orderId"] } }));
  }

  confirmUndeliverOrder() {
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
    const dialogRef = this.dialog.open(ConfirmUndeliverOrderModalComponent, config);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.navService.startLoading();
        this.undeliverOrder();
      }
    });
  }

  undeliverOrder() {
    this.store.dispatch(AdminActions.
      BeginUndeliverOrderAction({ payload: { "uid": this.route.snapshot.params["uid"], "orderId": this.route.snapshot.params["orderId"] } }));
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
        this.navService.startLoading();
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
        this.navService.startLoading();
        this.unfulfillOrder();
      }
    });
  }

  unfulfillOrder() {
    this.store.dispatch(AdminActions.
      BeginUnfulfillOrderAction({ payload: { "uid": this.route.snapshot.params["uid"], "orderId": this.route.snapshot.params["orderId"] } }));
  }

  goToCustomer() {
    this.navService.startLoading();
    this.router.navigateByUrl('/store/customers/' + this.route.snapshot.params["uid"]);
  }

  ngOnDestroy(): void {
    this.OrderSubscription.unsubscribe();
    this.SettingsSubscription.unsubscribe();
    this.FulfillSubscription.unsubscribe();
  }

}
