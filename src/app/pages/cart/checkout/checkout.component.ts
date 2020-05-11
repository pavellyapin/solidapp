import {Component , OnInit} from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { map, startWith } from 'rxjs/operators';
import CartState from 'src/app/services/store/cart/cart.state';
import { MediaObserver } from '@angular/flex-layout';
import { Card } from 'src/app/components/cards/card';
import { CartItem } from 'src/app/services/store/cart/cart.model';
import { ContentfulService } from 'src/app/services/contentful/contentful.service';
import { CartCardsService } from '../cart-cards/product-cards.service';
import { CartCardComponent } from '../cart-cards/cart-card/cart-card.component';
import { NavigationService } from 'src/app/services/navigation/navigation.service';

@Component({
  selector: 'doo-cart-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CartCheckoutComponent implements OnInit {

  cart$: Observable<CartItem[]>;
  CartSubscription: Subscription;
  actionSubscription: Subscription;
  cartItems: Array<CartItem>;
  cartItemsCards: Card[] = [];
  cols: Observable<number>;
  colsBig: Observable<number>;
  rowsBig: Observable<number>;
  previousUrl : string = '';

      constructor(store: Store<{ cart: CartState }>,
                  private mediaObserver: MediaObserver,
                  private cartItemsService: CartCardsService,
                  private contentfulService: ContentfulService,
                  private navService: NavigationService,)
        {
          this.cartItemsService.cards.subscribe(cards => {
            this.cartItemsCards = cards;
          });
          this.cart$ = store.pipe(select('cart','items'));
        }

  ngOnInit() {
    this.CartSubscription = this.cart$
    .pipe(
      map(x => {
        this.cartItems = x;
        this.cartItemsService.resetCards();
        this.createCards();
      })
    )
    .subscribe();


          /* Grid column map */
          const colsMap = new Map([
            ['xs', 12],
            ['sm', 4],
            ['md', 12],
            ['lg', 12],
            ['xl', 12],
          ]);
          /* Big card column span map */
          const colsMapBig = new Map([
            ['xs', 12],
            ['sm', 4],
            ['md', 12],
            ['lg', 12],
            ['xl', 12],
          ]);
          /* Small card column span map */
          const rowsMapBig = new Map([
            ['xs', 23],
            ['sm', 2],
            ['md', 5],
            ['lg', 5],
            ['xl', 5],
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

  createCards(): void {
     this.cartItems.forEach((v,index) => {
        this.contentfulService.getProductDetails(v.productId).forEach(
          x => {
            x.fields.variants = v.variants;
            x.fields.qty = v.qty;
            this.cartItemsService.addCard(
              new Card(
                {
                  name: {
                    key: Card.metadata.NAME,
                    value:  x.fields.title,
                  },
                  index: {
                    key: Card.metadata.INDEX,
                    value:  index,
                  },
                  object: {
                    key: Card.metadata.OBJECT,
                    value:  x,
                  },
                  cols: {
                    key: Card.metadata.COLS,
                    value: this['colsBig'],
                  },
                  rows: {
                    key: Card.metadata.ROWS,
                    value: this['rowsBig'],
                  }
                }, CartCardComponent, /* Reference to the component we'd like to spawn */
              ),
            );
          }
        )

      }
    );
  }


  ngOnDestroy(){
    this.CartSubscription.unsubscribe();
    this.cartItemsService.resetCards();
  }

}
