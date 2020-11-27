import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { Entry } from 'contentful';
import { NavigationService } from 'src/app/services/navigation/navigation.service';
import { Observable, Subscription } from 'rxjs';
import { Store, select } from '@ngrx/store';
import SettingsState from 'src/app/services/store/settings/settings.state';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-dashboard-home-page',
  templateUrl: './dashboard-home.component.html',
  styleUrls: ['./dashboard-home.component.scss']
})
export class DashboardHomeComponent implements OnInit {


  homePageContent : Entry<any>;
  settings$: Observable<Entry<any>[]>;
  SettingsSubscription: Subscription;

  constructor(store: Store<{ settings : SettingsState }> ,
              private navSerivce : NavigationService,
              private http: HttpClient) {
                
                this.settings$ = store.pipe(select('settings','pages'));
  }

  ngOnInit() {
    this.SettingsSubscription = this.settings$
    .pipe(
      map(x => {
        if (x) {
          this.homePageContent = x.filter(page=>{
            if (page.fields.type == 'dashboard') {
              //console.log(page);
              return page;
            }
          }).pop();
        }
        this.navSerivce.finishLoading();
      })
    )
    .subscribe();
  }

  ngOnDestroy(): void {
    this.SettingsSubscription.unsubscribe();
  }

}
