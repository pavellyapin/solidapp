import { Component} from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { FirestoreService } from 'src/app/services/firestore/firestore.service';
import { Card } from 'src/app/components/cards/card';
import { ActivatedRoute } from '@angular/router';
import { NavigationService } from 'src/app/services/navigation/navigation.service';


@Component({
    selector: 'doo-checkout-success',
    templateUrl: './success.component.html',
    styleUrls: ['./success.component.scss']
  })
  export class CheckoutSuccessComponent  {

    cartSubscription : Subscription;
    cart : any;
    cartItemsCards: Card[] = [];
    cols: Observable<number>;
    colsBig: Observable<number>;
    rowsBig: Observable<number>;

    constructor(private firestore : FirestoreService , 
                private navService : NavigationService,
                public route:ActivatedRoute) {
    }

    ngOnInit () {
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