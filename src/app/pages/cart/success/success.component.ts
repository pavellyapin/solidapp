import { Component} from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { FirestoreService } from 'src/app/services/firestore/firestore.service';
import { Card } from 'src/app/components/cards/card';
import { ActivatedRoute } from '@angular/router';
import { MediaObserver } from '@angular/flex-layout';


@Component({
    selector: 'doo-checkout-success',
    templateUrl: './success.component.html',
    styleUrls: ['./success.component.scss','../cart.component.scss']
  })
  export class CheckoutSuccessComponent  {

    cartSubscription : Subscription;
    cart : any;
    cartItemsCards: Card[] = [];
    cols: Observable<number>;
    colsBig: Observable<number>;
    rowsBig: Observable<number>;

    constructor(private firestore : FirestoreService , 
                public route:ActivatedRoute,
                private mediaObserver: MediaObserver) {
          /*this.cartItemsService.cards.subscribe(cards => {
            this.cartItemsCards = cards;
          });*/
    }

    ngOnInit () {
       this.cartSubscription = this.firestore.getCart(this.route.snapshot.params["order"]).pipe(
            map((data) => {
              console.log(this.route.snapshot.params["order"]);
              console.log(data);
              
                if (data.code == 400) {
                    this.cart = data.doc
                } else {
                    this.cart = data.payload.data();
                }
                console.log(this.cart);
              
                //this.cartItemsService.resetCards();
                //this.createCards();
            }) 
        ).subscribe();

        /* Grid column map */
        const colsMap = new Map([
            ['xs', 1],
            ['sm', 4],
            ['md', 8],
            ['lg', 12],
            ['xl', 12],
          ]);
          /* Big card column span map */
          const colsMapBig = new Map([
            ['xs', 1],
            ['sm', 4],
            ['md', 8],
            ['lg', 12],
            ['xl', 12],
          ]);
          /* Small card column span map */
          const rowsMapBig = new Map([
            ['xs', 2],
            ['sm', 2],
            ['md', 2],
            ['lg', 2],
            ['xl', 2],
          ]);
          let startCols: number;
          let startColsBig: number;
          let startRowsBig: number;
          colsMap.forEach((cols, mqAlias) => {
            if (this.mediaObserver.isActive(mqAlias)) {
              startCols = cols;
            }
          });
          colsMapBig.forEach((cols, mqAlias) => {
            if (this.mediaObserver.isActive(mqAlias)) {
              startColsBig = cols;
            }
          });
          rowsMapBig.forEach((rows, mqAliast) => {
            if (this.mediaObserver.isActive(mqAliast)) {
              startRowsBig = rows;
            }
          });
          const media$ = this.mediaObserver.asObservable();
          this.cols = media$.pipe(
            map(change => {
              return colsMap.get(change[0].mqAlias);
            }),
            startWith(startCols),
          );
          this.colsBig = media$.pipe(
            map(change => {
              return colsMapBig.get(change[0].mqAlias);
            }),
            startWith(startColsBig),
          );
          this.rowsBig = media$.pipe(
            map(change => {
              return rowsMapBig.get(change[0].mqAlias);
            }),
            startWith(startRowsBig),
          );
    }

    ngOnDestory() {
        this.cartSubscription.unsubscribe();
    }

  }