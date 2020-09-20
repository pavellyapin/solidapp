import { Component } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { FirestoreService } from 'src/app/services/firestore/firestore.service';
import { ActivatedRoute } from '@angular/router';
import { NavigationService } from 'src/app/services/navigation/navigation.service';
import { Store, select } from '@ngrx/store';
import SettingsState from 'src/app/services/store/settings/settings.state';
import { Entry } from 'contentful';
import { SEOService } from 'src/app/services/seo/seo.service';


@Component({
  selector: 'doo-checkout-success',
  templateUrl: './success.component.html',
  styleUrls: ['./success.component.scss']
})
export class CheckoutSuccessComponent {

  cartSubscription: Subscription;
  SettingsSubscription: Subscription;
  settings$: Observable<SettingsState>;
  siteSettings: Entry<any>;
  successPageContent : Entry<any>;
  cart: any;

  constructor(private firestore: FirestoreService,
    store: Store<{ settings : SettingsState}>,
    private navService: NavigationService,
    public route: ActivatedRoute,
    private seoService : SEOService) {
    this.settings$ = store.pipe(select('settings'));
  }

  ngOnInit() {
    this.SettingsSubscription = this.settings$
    .pipe(
      map(x => {
        this.siteSettings = x.siteConfig;
        this.successPageContent = x.pages.filter(page=>{
          if (page.fields.type == 'success') {
            this.seoService.updateTitle(page.fields.title);
            this.seoService.updateDescription(page.fields.description);
            this.seoService.updateOgUrl(window.location.href);
            return page;
          }
        }).pop();
      })
    )
    .subscribe();

    this.cartSubscription = this.firestore.getCartData(this.route.snapshot.params["order"]).pipe(
      map((data) => {
        this.navService.finishLoading();
        this.cart = data.data();
      })
    ).subscribe();
  }

  ngOnDestory() {
    this.cartSubscription.unsubscribe();
  }

}