import { Component, OnInit, ViewChild } from '@angular/core';
import { map } from 'rxjs/operators';
import { Entry } from 'contentful';
import { NavigationService } from 'src/app/services/navigation/navigation.service';
import { Observable, Subscription } from 'rxjs';
import { Store, select } from '@ngrx/store';
import SettingsState from 'src/app/services/store/settings/settings.state';
import AdminState from 'src/app/services/store/admin/admin.state';
import * as AdminActions from 'src/app/services/store/admin/admin.action';
import { MatCalendar } from '@angular/material/datepicker';
import { MatMenuTrigger } from '@angular/material/menu';
import { Router } from '@angular/router';
import { UtilitiesService } from 'src/app/services/util/util.service';

@Component({
  selector: 'app-dashboard-home-page',
  templateUrl: './dashboard-home.component.html',
  styleUrls: ['./dashboard-home.component.scss']
})
export class DashboardHomeComponent implements OnInit {


  @ViewChild('dooCalendar',{static: false}) calendar: MatCalendar<Date>;
  @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger;

  homePageContent: Entry<any>;
  settings$: Observable<SettingsState>;
  SettingsSubscription: Subscription;

  admin$: Observable<AdminState>;
  AdminSubscription: Subscription;

  isSummaryOpen: boolean = true;
  resolution: any;
  newOrders: any;
  stats: any;
  selectedDate = new Date();
  currentLookup = "today";
  isQuickLook:boolean = true;

  constructor(private store: Store<{ settings: SettingsState, admin: AdminState }>,
    private navSerivce: NavigationService,
    private router: Router,
    public utilService: UtilitiesService) {

    this.settings$ = store.pipe(select('settings'));
    this.admin$ = store.pipe(select('admin'));
  }

  ngOnInit() {

      this.SettingsSubscription = this.settings$
      .pipe(
        map(x => {
          this.resolution = x.resolution;
        })
      )
      .subscribe();

    this.AdminSubscription = this.admin$
      .pipe(
        map(x => {
          if (x.newOrders) {
            this.newOrders = x.newOrders.length;
          }
          if (x.stats) {
            this.stats = x.stats;
          }

          if (x.newOrders && x.stats) {
            this.navSerivce.finishLoading();
          }
        })
      )
      .subscribe();
  }

  cleanupUsers() {
    this.store.dispatch(AdminActions.BeginCleanupUsersAction());
  }

  getStatsQuickLook(quickLook: any) {
    this.currentLookup = quickLook;
    this.isQuickLook = true;
    this.navSerivce.startLoading();
    this.store.dispatch(AdminActions.BeginStatsPerPeriodAction({ payload: { quickLook: quickLook } }));
  }

  getStatsForDate($event: Date) {
    this.selectedDate = $event;
    this.isQuickLook = false;
    this.trigger.closeMenu();
    this.navSerivce.startLoading();
    this.store.dispatch(AdminActions.BeginStatsPerPeriodAction({
      payload: {
        startDate: {
          year: $event.getFullYear(),
          month: $event.getMonth(),
          day: $event.getDate()
        }
      }
    }));
  }

  goToOrder() {
    this.navSerivce.startLoading();
    this.router.navigateByUrl('store/orders');
  }

  ngOnDestroy(): void {
    this.SettingsSubscription.unsubscribe();
    this.AdminSubscription.unsubscribe();
  }

}
