import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { Entry } from 'contentful';
import { NavigationService } from 'src/app/services/navigation/navigation.service';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { Store, select } from '@ngrx/store';
import SettingsState from 'src/app/services/store/settings/settings.state';
import { Observable, Subscription } from 'rxjs';
import { SEOService } from 'src/app/services/seo/seo.service';

@Component({
  selector: 'app-custom-page',
  templateUrl: './custom.component.html',
  styleUrls: ['./custom.component.scss']
})
export class CustomComponent implements OnInit {


  customPageContent : Entry<any>;
  settings$: Observable<Entry<any>[]>;
  SettingsSubscription: Subscription;
  RouterSubscription: Subscription;

  sitePages : Entry<any>[];

  constructor(store: Store<{ settings : SettingsState }> ,
              public route: ActivatedRoute, 
              private router: Router,
              private navService : NavigationService,
              private seoService : SEOService) {
                
                this.settings$ = store.pipe(select('settings','pages'));
  }

  ngOnInit() {
    this.SettingsSubscription = this.settings$
    .pipe(
      map(x => {
        if (x) {
          this.sitePages = x;
          this.getCustomPage();
        }
      })
    )
    .subscribe();

    this.RouterSubscription = this.router.events.subscribe((val) => {
      if(val instanceof NavigationEnd) {
        this.getCustomPage();
      }
    });
  }

  getCustomPage() {
    this.navService.startLoading();
    this.customPageContent = this.sitePages.filter(page=>{
      if (page.fields.name == this.route.snapshot.params['page']) {
        this.seoService.updateTitle(page.fields.title);
        this.seoService.updateDescription(page.fields.description);
        this.seoService.updateOgUrl(window.location.href);
        return page;
      }
    }).pop();
    this.navService.finishLoading();
  }

  ngOnDestroy(): void {
    this.SettingsSubscription.unsubscribe();
    this.RouterSubscription.unsubscribe();
  }

}
