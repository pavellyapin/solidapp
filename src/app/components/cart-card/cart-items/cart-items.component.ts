import {Component , OnInit, Input} from '@angular/core';
import { Observable, Subscription, BehaviorSubject } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MediaObserver } from '@angular/flex-layout';
import { CartCardComponent } from 'src/app/components/cart-card/cart-card.component';
import { CartCard } from '../cart-card';

@Component({
  selector: 'doo-cart-items',
  templateUrl: './cart-items.component.html',
  styleUrls: ['./cart-items.component.scss']
})
export class CartItemsComponent implements OnInit {

 

  @Input() set cartItems(cartItems : Array<any>){
      this._cartItems = cartItems
      this.resetCards();
      if (this._cartItems) {
        this.createCards();
      }
  };

  _cartItems : Array<any>;
  actionSubscription: Subscription;
  cartItemsCards: CartCard[] = [];
  cols: Observable<number>;
  colsBig: Observable<number>;
  rowsBig: Observable<number>;
  previousUrl : string = '';

  cards: BehaviorSubject<CartCard[]> = new BehaviorSubject<CartCard[]>([]);

      constructor(private mediaObserver: MediaObserver)
        {
          this.cards.subscribe(cards => {
            this.cartItemsCards = cards;
          });
        }

  ngOnInit() {

          let startCols: number;
          let startColsBig: number;
          let startRowsBig: number;
          CartCard.colsMap.forEach((cols, mqAlias) => {
            if (this.mediaObserver.isActive(mqAlias)) {
              startCols = cols;
            }
          });
          CartCard.colsMapBig.forEach((cols, mqAlias) => {
            if (this.mediaObserver.isActive(mqAlias)) {
              startColsBig = cols;
            }
          });
          CartCard.rowsMapBig.forEach((rows, mqAliast) => {
            if (this.mediaObserver.isActive(mqAliast)) {
              startRowsBig = rows;
            }
          });
          const media$ = this.mediaObserver.asObservable();
          this.cols = media$.pipe(
            map(change => {
              return CartCard.colsMap.get(change[0].mqAlias);
            }),
            startWith(startCols),
          );
          this.colsBig = media$.pipe(
            map(change => {
              return CartCard.colsMapBig.get(change[0].mqAlias);
            }),
            startWith(startColsBig),
          );
          this.rowsBig = media$.pipe(
            map(change => {
              return CartCard.rowsMapBig.get(change[0].mqAlias);
            }),
            startWith(startRowsBig),
          );
  }

  addCard(card: CartCard): void {
    this.cards.next(this.cards.getValue().concat(card));
  }

  resetCards(): void {
    this.cards.getValue().splice(0,this.cards.getValue().length);
  }

  createCards(): void {
     this._cartItems.forEach((v,index) => {
            if (v) {
              this.addCard(
                new CartCard(
                  {
                    name: {
                      key: CartCard.metadata.NAME,
                      value:  v.product.fields.title,
                    },
                    index: {
                      key: CartCard.metadata.INDEX,
                      value:  index,
                    },
                    object: {
                      key: CartCard.metadata.OBJECT,
                      value:  v,
                    },
                    cols: {
                      key: CartCard.metadata.COLS,
                      value: this['colsBig'],
                    },
                    rows: {
                      key: CartCard.metadata.ROWS,
                      value: this['rowsBig'],
                    }
                  }, CartCardComponent, /* Reference to the component we'd like to spawn */
                ),
              );
            }
      }
    );
  }


  ngOnDestroy(){
    this.resetCards();
  }

}
