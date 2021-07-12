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
import { ConfirmReviewSubscriptionModalComponent } from '../modals/confirm-review/confirm-review.component';
import { ConfirmUnReviewSubscriptionModalComponent } from '../modals/confirm-unreview/confirm-unreview.component';
import { UserPermissions } from 'src/app/services/store/user/user.model';
import UserState from 'src/app/services/store/user/user.state';
import { SendEmailModalComponent } from '../modals/send-email/send-email.component';

@Component({
  selector: 'app-dashboard-subscription-details',
  templateUrl: './subscription-details.component.html',
  styleUrls: ['./subscription-details.component.scss']
})
export class DashboardSubscriptionDetailsComponent implements OnInit {


  SubscriptionSubscription: Subscription;
  ReviewSubscription: Subscription;
  SettingsSubscription: Subscription;
  settings$: Observable<SettingsState>;
  resolution: any;


  user$: Observable<UserPermissions>;
  UserSubscription: Subscription;

  subscription: any;
  siteSettings: any;
  permissions: any;
  activeDates: any;

  constructor(private store: Store<{ settings: SettingsState, user: UserState }>,
    private navSerivce: NavigationService,
    private _actions$: Actions,
    private dialog: MatDialog,
    private utilService: UtilitiesService,
    public route: ActivatedRoute) {

    this.settings$ = store.pipe(select('settings'));
    this.user$ = store.pipe(select('user', 'permissions'))
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

    this.UserSubscription = this.user$
      .pipe(
        map(x => {
          this.permissions = x;
        })
      )
      .subscribe();

    this.store.dispatch(AdminActions.
      BeginLoadSubscriptionDetailsAction({ payload: { "uid": this.route.snapshot.params["uid"], "subscriptionId": this.route.snapshot.params["subscriptionId"] } }));
    this.SubscriptionSubscription = this._actions$.pipe(ofType(AdminActions.SuccessLoadSubscriptionDetailsAction)).subscribe((result) => {
      this.subscription = result.payload;
      const dates = new Map<String, Array<any>>();
      const subscriptionDate = new Date(parseInt(this.subscription.subscription.date, 10));
      const dateString = subscriptionDate.getMonth() + " " + subscriptionDate.getDate() + "," + subscriptionDate.getFullYear();

      dates.set(dateString, [{ action: 'created', date: parseInt(this.subscription.subscription.date, 10) }]);

      if (this.subscription.review && this.subscription.review.status) {
        const reviewDate = new Date(parseInt(this.subscription.review.updateDate, 10));
        const reviewDateString = reviewDate.getMonth() + " " + reviewDate.getDate() + "," + reviewDate.getFullYear();
        if (dates.get(reviewDateString)) {
          dates.get(reviewDateString).push({ action: 'reviewed', date: this.subscription.review.updateDate })
        } else {
          dates.set(reviewDateString, [{ action: 'reviewed', date: this.subscription.review.updateDate }]);
        }
      }

      if (this.subscription.emails) {
        for (let email of this.subscription.emails) {
          const emailDate = new Date(email.updateDate);
          const emailDateString = emailDate.getMonth() + " " + emailDate.getDate() + "," + emailDate.getFullYear();
          if (dates.get(emailDateString)) {
            dates.get(emailDateString).push({ action: 'sent', date: email.updateDate , name: email.templateName })
          } else {
            dates.set(emailDateString, [{ action: 'sent', date: email.updateDate , name: email.templateName }]);
          }
        }
      }

      dates.set(dateString, dates.get(dateString).reverse());
      this.activeDates = new Map([...dates.entries()]);
      this.activeDates.forEach(dayTime=> {
        dayTime.sort(this.dayTimeOrder);
      });

      this.navSerivce.finishLoading();
    });
    this.ReviewSubscription = this._actions$.
      pipe(ofType(
        AdminActions.SuccessReviewSubscriptionAction,
        AdminActions.SuccessUnReviewSubscriptionAction,
        AdminActions.SuccessSendEmailAction)).subscribe((result) => {
          this.store.dispatch(AdminActions.
            BeginLoadSubscriptionDetailsAction({ payload: { "uid": this.route.snapshot.params["uid"], "subscriptionId": this.route.snapshot.params["subscriptionId"] } }));
        });
  }

  dayTimeOrder(a: any, b: any): number {
    return a.date < b.date ? 1 : (b.date < a.date ? -1 : 0);
  }

  keyDescOrder(a: KeyValue<number, string>, b: KeyValue<number, string>): number {
    return a.key < b.key ? 1 : (b.key < a.key ? -1 : 0);
  }

  confirmReviewSubscription() {
    let config;

    config = {
      position: {
        top: '0px',
        right: '0px'
      },
      height: '100%',
      width: '100vw',
      panelClass: 'full-screen-modal',
      data: { subscription: this.subscription }
    };
    const dialogRef = this.dialog.open(ConfirmReviewSubscriptionModalComponent, config);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.navSerivce.startLoading();
        this.reviewSubscription();
      }
    });
  }

  reviewSubscription() {
    this.store.dispatch(AdminActions.
      BeginReviewSubscriptionAction({ payload: { "uid": this.route.snapshot.params["uid"], "subscriptionId": this.route.snapshot.params["subscriptionId"] } }));
  }

  confirmUnreviewSubscription() {
    let config;

    config = {
      position: {
        top: '0px',
        right: '0px'
      },
      height: '100%',
      width: '100vw',
      panelClass: 'full-screen-modal',
      data: { subscription: this.subscription }
    };
    const dialogRef = this.dialog.open(ConfirmUnReviewSubscriptionModalComponent, config);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.navSerivce.startLoading();
        this.unreviewSubscription();
      }
    });
  }

  unreviewSubscription() {
    this.store.dispatch(AdminActions.
      BeginUnReviewSubscriptionAction({ payload: { "uid": this.route.snapshot.params["uid"], "subscriptionId": this.route.snapshot.params["subscriptionId"] } }));
  }

  confirmSendEmail() {
    let config;

    config = {
      position: {
        top: '0px',
        right: '0px'
      },
      height: '100%',
      width: '100vw',
      panelClass: 'full-screen-modal',
      data: { permissions: this.permissions }
    };
    const dialogRef = this.dialog.open(SendEmailModalComponent, config);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.navSerivce.startLoading();
        this.sendEmail(result);
      }
    });
  }

  sendEmail(result) {
    this.store.dispatch(AdminActions.
      BeginSendEmailAction({ payload: { "uid": this.route.snapshot.params["uid"], "subscriptionId": this.route.snapshot.params["subscriptionId"], "email": result } }));
  }

  ngOnDestroy(): void {
    this.SubscriptionSubscription.unsubscribe();
    this.SettingsSubscription.unsubscribe();
    this.ReviewSubscription.unsubscribe();
    this.UserSubscription.unsubscribe();
  }

}
