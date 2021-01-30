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
import { Router } from '@angular/router';
import * as AdminActions from 'src/app/services/store/admin/admin.action';
import AdminState from 'src/app/services/store/admin/admin.state';

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
  NewOrdersSubscription: Subscription;
  siteSettings: Entry<any>;

  resolution: any;
  bigScreens = new Array('lg', 'xl', 'md')
  loading: any;
  searchControl = new FormControl();
  filteredOptions: Observable<Entry<any>[]>;

  isAppsOpen: boolean = true;
  orderCount: number;
  interval: any;
  env:any;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private router: Router,
    private store: Store<{ settings: SettingsState , admin: AdminState }>,
    private _actions$: Actions,
    private utilService: UtilitiesService,
    public navService: NavigationService) {

    this.settings$ = store.pipe(select('settings'));
    this.admin$ = store.pipe(select('admin','env'));
  }

  ngOnInit(): void {
    //throw new Error("Method not implemented.");
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

      this.NewOrdersSubscription = this._actions$.pipe(ofType(AdminActions.SuccessLoadNewOrdersAction)).subscribe((result) => {
        this.orderCount = result.payload.length;
      });

      this.interval = setInterval(() => {
        //this.store.dispatch(AdminActions.BeginLoadNewOrdersAction());
      },5000)
  }

  envChange($event) {
    this.store.dispatch(AdminActions.SuccessSetAdminEnvAction({payload : $event.checked ? 'prod' : 'test'}));
    this.router.navigateByUrl('store');
    this.store.dispatch(AdminActions.BeginLoadNewOrdersAction());
  }

  navigateApp(app) {
    this.navService.startLoading();
    switch (app) {
      case "customers":
        this.router.navigateByUrl('store/customers');
        break;
      case "carts":
        this.router.navigateByUrl('store/carts');
        break;
      case "orders":
        this.router.navigateByUrl('store/orders');
        break;
    }

  }

  ngOnDestroy(): void {
    clearInterval(this.interval);
    this.SettingsSubscription.unsubscribe();
    this.AdminSubscription.unsubscribe();
  }

}