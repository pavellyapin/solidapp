import {Component , OnInit, Input} from '@angular/core';
import { Observable, Subscription, BehaviorSubject } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MediaObserver } from '@angular/flex-layout';
import { Card } from 'src/app/components/cards/card';
import { CartCardComponent } from 'src/app/components/cart-card/cart-card.component';

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
  cartItemsCards: Card[] = [];
  cols: Observable<number>;
  colsBig: Observable<number>;
  rowsBig: Observable<number>;
  previousUrl : string = '';

  cards: BehaviorSubject<Card[]> = new BehaviorSubject<Card[]>([]);

      constructor(private mediaObserver: MediaObserver)
        {
          this.cards.subscribe(cards => {
            this.cartItemsCards = cards;
          });
        }

  ngOnInit() {

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

  addCard(card: Card): void {
    this.cards.next(this.cards.getValue().concat(card));
  }

  resetCards(): void {
    this.cards.getValue().splice(0,this.cards.getValue().length);
  }

  createCards(): void {
     this._cartItems.forEach((v,index) => {
            if (v) {
              this.addCard(
                new Card(
                  {
                    name: {
                      key: Card.metadata.NAME,
                      value:  v.fields.title,
                    },
                    index: {
                      key: Card.metadata.INDEX,
                      value:  index,
                    },
                    object: {
                      key: Card.metadata.OBJECT,
                      value:  v,
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
      }
    );
  }


  ngOnDestroy(){
    this.resetCards();
  }

}
