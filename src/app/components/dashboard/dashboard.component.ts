import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import SettingsState from 'src/app/services/store/settings/settings.state';
import { Observable, Subscription } from 'rxjs';
import { Entry } from 'contentful';
import { map } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { select, Store } from '@ngrx/store';
import { NavigationService } from 'src/app/services/navigation/navigation.service';
import { UtilitiesService } from 'src/app/services/util/util.service';
import { Actions, ofType } from '@ngrx/effects';
import { Router, NavigationEnd } from '@angular/router';
import * as AdminActions from 'src/app/services/store/admin/admin.action';
import AdminState from 'src/app/services/store/admin/admin.state';
import { DashboardConstants } from 'src/app/components/dashboard/dashboard.constants';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {

  settings$: Observable<SettingsState>;
  admin$: Observable<any>;
  SettingsSubscription: Subscription;
  AdminSubscription: Subscription;
  RouterSubscription: Subscription;
  NewOrdersSubscription: Subscription;
  NewOrdersSubscriptionStart: Subscription;
  siteSettings: Entry<any>;

  resolution: any;
  loading: any;
  circleLoading: boolean = true;
  searchControl = new FormControl();
  filteredOptions: Observable<Entry<any>[]>;

  isAppsOpen: boolean = true;
  currentApp: any;
  orderCount: number;
  interval: any;
  env: any;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private router: Router,
    private store: Store<{ settings: SettingsState, admin: AdminState }>,
    private _actions$: Actions,
    public utilService: UtilitiesService,
    public navService: NavigationService,
    public constants: DashboardConstants) {

    this.settings$ = store.pipe(select('settings'));
    this.admin$ = store.pipe(select('admin', 'env'));
  }

  ngOnInit(): void {
    this.SettingsSubscription = this.settings$
      .pipe(
        map(x => {
          this.resolution = x.resolution;
          this.siteSettings = x.siteConfig;
          this.loading = x.loading;
          this.changeDetectorRef.detectChanges();
        })
      )
      .subscribe();

    this.AdminSubscription = this.admin$
      .pipe(
        map(x => {
          this.env = x;
        })
      )
      .subscribe();

    this.NewOrdersSubscriptionStart = this._actions$.pipe(ofType(AdminActions.BeginLoadNewOrdersAction)).subscribe((result) => {
      this.circleLoading = true;
    });

    this.NewOrdersSubscription = this._actions$.pipe(ofType(AdminActions.SuccessLoadNewOrdersAction)).subscribe((result) => {
      this.circleLoading = false;
      this.orderCount = result.payload.length;
    });

    this.interval = setInterval(() => {
      //this.store.dispatch(AdminActions.BeginLoadNewOrdersAction());
    }, 5000)


    this.currentApp = this.router.routerState.snapshot.url;
    this.RouterSubscription = this.router.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
        this.currentApp = val.url;
      }
    });
  }

  envChange($event) {
    this.store.dispatch(AdminActions.SuccessSetAdminEnvAction({ payload: $event.checked ? 'prod' : 'test' }));
    this.router.navigateByUrl('store');
    this.store.dispatch(AdminActions.BeginLoadNewOrdersAction());
  }

  navigateApp(app) {
    if(!this.utilService.bigScreens.includes(this.resolution)) {
      this.isAppsOpen = false;
    }
    if (this.currentApp != app) {
      this.navService.startLoading();
    }

    switch (app) {
      case this.constants.customersDashboard:
        this.router.navigateByUrl(this.constants.customersDashboard);
        break;
      case this.constants.cartsDashboard:
        this.router.navigateByUrl(this.constants.cartsDashboard);
        break;
      case this.constants.ordersDashboard:
        this.router.navigateByUrl(this.constants.ordersDashboard);
        break;
      case this.constants.homeDashboard:
        this.router.navigateByUrl(this.constants.homeDashboard);
        break;
    }

  }

  toggleMobileSideMenu($event){
    console.log($event);
  }

  ngOnDestroy(): void {
    clearInterval(this.interval);
    this.SettingsSubscription.unsubscribe();
    this.AdminSubscription.unsubscribe();
    this.RouterSubscription.unsubscribe();
    this.NewOrdersSubscriptionStart.unsubscribe();
    this.NewOrdersSubscription.unsubscribe();
  }

}