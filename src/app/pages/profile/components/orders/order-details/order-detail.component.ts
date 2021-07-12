import { Component, OnInit } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { NavigationService } from 'src/app/services/navigation/navigation.service';
import { SEOService } from 'src/app/services/seo/seo.service';
import SettingsState from 'src/app/services/store/settings/settings.state';
import { Entry } from 'contentful';
import { Store, select } from '@ngrx/store';
import { FirestoreOrderService } from 'src/app/services/firestore/sub-services/firestore-order.service';

@Component({
  selector: 'doo-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.scss']
})
export class OrderDeatilComponent implements OnInit {

  cartSubscription: Subscription;
  SettingsSubscription: Subscription;
  settings$: Observable<SettingsState>;
  siteSettings: Entry<any>;
  
  cart: any;

  constructor(private firestore: FirestoreOrderService,
    store: Store<{ settings : SettingsState}>,
    private navService: NavigationService,
    public route: ActivatedRoute,
    private seoService: SEOService) {
    this.settings$ = store.pipe(select('settings'));
  }

  ngOnInit() {

    this.SettingsSubscription = this.settings$
    .pipe(
      map(x => {
        this.siteSettings = x.siteConfig;
      })
    )
    .subscribe();

    this.cartSubscription = this.firestore.getCartData(this.route.snapshot.params["orderId"]).pipe(
      map((data) => {
        this.navService.finishLoading();
        this.seoService.updateTitle("Order Details");
        this.seoService.updateOgUrl(window.location.href);
        this.cart = data.data();
      })
    ).subscribe();
  }

  ngOnDestory() {
    this.cartSubscription.unsubscribe();
  }
}