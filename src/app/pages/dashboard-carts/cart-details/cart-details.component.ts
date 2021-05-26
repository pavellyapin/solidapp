import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { NavigationService } from 'src/app/services/navigation/navigation.service';
import { Observable, Subscription } from 'rxjs';
import { Store, select } from '@ngrx/store';
import SettingsState from 'src/app/services/store/settings/settings.state';
import { ActivatedRoute } from '@angular/router';
import * as AdminActions from 'src/app/services/store/admin/admin.action';
import { ofType, Actions } from '@ngrx/effects';
import { MatDialog } from '@angular/material/dialog';
import { UtilitiesService } from 'src/app/services/util/util.service';
import { KeyValue } from '@angular/common';
import { ConfirmReviewCartModalComponent } from '../modals/confirm-review/confirm-review.component';
import { ConfirmUnReviewCartModalComponent } from '../modals/confirm-unreview/confirm-unreview.component';

@Component({
  selector: 'app-dashboard-cart-details',
  templateUrl: './cart-details.component.html',
  styleUrls: ['./cart-details.component.scss']
})
export class DashboardCartDetailsComponent implements OnInit {


  CartSubscription: Subscription;
  ReviewSubscription: Subscription;
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
      BeginLoadCartDetailsAction({ payload: { "uid": this.route.snapshot.params["uid"], "cartId": this.route.snapshot.params["cartId"] } }));
    this.CartSubscription = this._actions$.pipe(ofType(AdminActions.SuccessLoadCartDetailsAction)).subscribe((result) => {
      this.order = result.payload;
      const dates = new Map<String, Array<any>>();
      const cartDate = new Date(parseInt(this.order.order.cart.date, 10));
      const dateString = cartDate.getMonth() + " " + cartDate.getDate() + "," + cartDate.getFullYear();
      
      dates.set(dateString, [{action : 'created' , date : this.order.order.cart.date}]);

      if(this.order.review && this.order.review.status) {
        const reviewDate = new Date(parseInt(this.order.review.updateDate, 10));
        const reviewDateString = reviewDate.getMonth() + " " + reviewDate.getDate() + "," + reviewDate.getFullYear();
        if (dates.get(reviewDateString)) {
          dates.get(reviewDateString).push({action : 'reviewed' , date : this.order.review.updateDate})
        } else {
          dates.set(reviewDateString, [{action : 'reviewed' , date : this.order.review.updateDate}]);
        }
      }
      dates.set(dateString,dates.get(dateString).reverse());   
      this.activeDates = new Map([...dates.entries()]);
      this.navSerivce.finishLoading();
    });
    this.ReviewSubscription = this._actions$.pipe(ofType(AdminActions.SuccessReviewCartAction,AdminActions.SuccessUnReviewCartAction)).subscribe((result) => {
      this.store.dispatch(AdminActions.
        BeginLoadCartDetailsAction({ payload: { "uid": this.route.snapshot.params["uid"], "cartId": this.route.snapshot.params["cartId"] } }));
    });
  }

  keyDescOrder (a: KeyValue<number,string>, b: KeyValue<number,string>): number {
    return a.key < b.key ? 1 : (b.key < a.key ? -1 : 0);
  }

  confirmReviewCart() {
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
    const dialogRef = this.dialog.open(ConfirmReviewCartModalComponent, config);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.navSerivce.startLoading();
        this.reviewCart();
      }
    });
  }

  reviewCart() {
    this.store.dispatch(AdminActions.
      BeginReviewCartAction({ payload: { "uid": this.route.snapshot.params["uid"], "cartId": this.route.snapshot.params["cartId"] } }));
  }

  confirmUnreviewCart() {
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
    const dialogRef = this.dialog.open(ConfirmUnReviewCartModalComponent, config);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.navSerivce.startLoading();
        this.unreviewCart();
      }
    });
  }

  unreviewCart() {
    this.store.dispatch(AdminActions.
      BeginUnReviewCartAction({ payload: { "uid": this.route.snapshot.params["uid"], "cartId": this.route.snapshot.params["cartId"] } }));
  }

  ngOnDestroy(): void {
    this.CartSubscription.unsubscribe();
    this.SettingsSubscription.unsubscribe();
    this.ReviewSubscription.unsubscribe();
  }

}
