import {Component, OnInit, ChangeDetectorRef, ViewChild} from '@angular/core';
import SettingsState from 'src/app/services/store/settings/settings.state';
import { Observable, Subscription } from 'rxjs';
import { Entry } from 'contentful';
import { map } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { select, Store } from '@ngrx/store';
import { NavigationService } from 'src/app/services/navigation/navigation.service';
import { UtilitiesService } from 'src/app/services/util/util.service';
import { Actions } from '@ngrx/effects';
import { Router } from '@angular/router';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
  })
  export class DashboardComponent implements OnInit {

    settings$: Observable<SettingsState>;
    SettingsSubscription: Subscription;
    siteSettings: Entry<any>;

    resolution : any;
    bigScreens = new Array('lg' , 'xl' , 'md')
    loading : any;
    searchControl = new FormControl();
    filteredOptions: Observable<Entry<any>[]>;

    isAppsOpen : boolean = true;
  
    constructor(
        private changeDetectorRef: ChangeDetectorRef,
        private router: Router,
        private store: Store<{ settings: SettingsState}>,
        private _actions$: Actions,
        private utilService : UtilitiesService,
        public navService: NavigationService) {
    
        this.settings$ = store.pipe(select('settings'));
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
    }

    navigateApp(app) {
      this.navService.startLoading();
      switch(app){
        case  "customers":
          this.router.navigateByUrl('store/customers');
          break;
        case  "orders":
          this.router.navigateByUrl('store/orders');
          break;
      }

    }

  }