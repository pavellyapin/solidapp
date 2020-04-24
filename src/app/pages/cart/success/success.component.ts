import { Component } from '@angular/core';
import { FirestoreService } from 'src/app/services/firestore/firestore.service';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
    selector: 'doo-checkout-success',
    templateUrl: './success.component.html',
    styleUrls: ['./success.component.scss']
  })
  export class CheckoutSuccessComponent  {

    cartSubscription : Subscription;

    constructor(private firestore : FirestoreService , 
                private route:ActivatedRoute) {

    }

    ngOnInit () {
        console.log(this.route.snapshot.params["order"]);
       /* this.cartSubscription = this.firestore.getCart(this.route.params["order"]).pipe(
            map((data) => {
                console.log(data);
            }) 
        ).subscribe(); */
    }

    ngOnDestory() {
        this.cartSubscription.unsubscribe();
    }

  }