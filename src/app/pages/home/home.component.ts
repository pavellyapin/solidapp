import { Component, OnInit } from '@angular/core';
import { ContentfulService } from 'src/app/services/contentful/contentful.service';
import { map } from 'rxjs/operators';
import { Entry } from 'contentful';
import { NavigationService } from 'src/app/services/navigation/navigation.service';
import { Observable, Subscription } from 'rxjs';
import { Store, select } from '@ngrx/store';
import SettingsState from 'src/app/services/store/settings/settings.state';

@Component({
  selector: 'app-home-page',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {


  homePageContent : Entry<any>;
  settings$: Observable<Entry<any>[]>;
  SettingsSubscription: Subscription;

  constructor(store: Store<{ settings : SettingsState }> ,
              private navSerivce : NavigationService) {
                
                this.settings$ = store.pipe(select('settings','pages'));
  }

  ngOnInit() {
    this.SettingsSubscription = this.settings$
    .pipe(
      map(x => {
        if (x) {
          this.homePageContent = x.filter(page=>{
            if (page.fields.type == 'main') {
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
