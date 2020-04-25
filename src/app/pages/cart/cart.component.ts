import {Component , OnInit, Inject} from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { map, startWith } from 'rxjs/operators';
import CartState from 'src/app/services/store/cart/cart.state';
import { CartCardsService } from './cart-cards/product-cards.service';
import { MediaObserver } from '@angular/flex-layout';
import { Card } from 'src/app/components/cards/card';
import { CartCardComponent } from './cart-cards/cart-card/cart-card.component';
import { CartItem } from 'src/app/services/store/cart/cart.model';
import { ContentfulService } from 'src/app/services/contentful/contentful.service';
import { NavigationService } from 'src/app/services/navigation/navigation.service';
import { Router } from '@angular/router';
import { FirestoreService } from 'src/app/services/firestore/firestore.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import {VariantsPipe} from '../../components/pipes/pipes'
import * as CartActions from '../../services/store/cart/cart.action';
import { Actions, ofType } from '@ngrx/effects';

@Component({
  selector: 'doo-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {

  cart$: Observable<CartItem[]>;
  CartSubscription: Subscription;
  cartItems: Array<CartItem>;
  cartItemsCards: Card[] = [];
  cartItemCount: number;
  cartTotal: number;
  cols: Observable<number>;
  colsBig: Observable<number>;
  rowsBig: Observable<number>;
  previousUrl : string = '';

      constructor(private store: Store<{ cart: CartState }>,
                  private mediaObserver: MediaObserver,
                  private cartItemsService: CartCardsService,
                  private contentfulService: ContentfulService,
                  private navService: NavigationService,
                  private router: Router,
                  private dialog: MatDialog,
                  private variantPipe : VariantsPipe)
        {
          this.cartItemsService.cards.subscribe(cards => {
            this.cartItemsCards = cards;
          });
          this.cart$ = store.pipe(select('cart','items'));
        }

  ngOnInit() {
    this.navService.getPreviousUrl().forEach((segment) => {
      this.previousUrl = this.previousUrl + '/' + segment 
    });

    this.CartSubscription = this.cart$
    .pipe(
      map(x => {
        this.cartItems = x;
        this.cartItemCount = 0;
        this.cartItems.forEach((item)=>{
          this.cartItemCount = this.cartItemCount + item.qty;
        })
        this.cartItemsService.resetCards();
        this.createCards();
      })
    )
    .subscribe();

          /* Grid column map */
          const colsMap = new Map([
            ['xs', 1],
            ['sm', 4],
            ['md', 8],
            ['lg', 8],
            ['xl', 8],
          ]);
          /* Big card column span map */
          const colsMapBig = new Map([
            ['xs', 1],
            ['sm', 4],
            ['md', 8],
            ['lg', 8],
            ['xl', 8],
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

  createCards(): void {
    this.cartTotal = 0;
    this.cartItems.forEach((v,index) => {
        this.contentfulService.getProductDetails(v.productId).forEach(
          x => {
            this.cartTotal = this.cartTotal + (v.qty*(x.fields.discount ? x.fields.discount : x.fields.price));
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

  payPalPay() {
    let reqCart = [];
        
    this.cartItemsService.cards.value.forEach(function(item){
          reqCart.push(
            {product_id : item.input.object.value.sys.id,
             thumbnail : item.input.object.value.fields.media[0].fields.file.url,
             name : item.input.name.value +  
             (item.input.object.value.fields.variants ? 
              this.variantPipe.transform(item.input.object.value.fields.variants) : ''),
             qty : item.input.object.value.fields.qty,
             price : item.input.object.value.fields.discount ? 
                     item.input.object.value.fields.discount : 
                     item.input.object.value.fields.price }
          )
        }.bind(this));

        this.store.dispatch(CartActions.BeginInitializeOrderAction({payload :{cart : reqCart , total : this.cartTotal.toFixed(2)}}));
        
        const dialogRef = this.dialog.open(PayPalModalComponent, {
          width: '750px',
          data: {cart: reqCart, total: this.cartTotal.toFixed(2)}
        });
      
  }

  navigateToPrevious() {
    this.navService.resetStack([]);
    this.router.navigateByUrl(this.previousUrl);
  }

  ngOnDestroy(){
    this.CartSubscription.unsubscribe();
    this.cartItemsService.resetCards();
  }

}


@Component({
  selector: 'doo-paypal-modal',
  templateUrl: './paypal/paypal-modal.component.html',
  styleUrls: ['./paypal/paypal-modal.component.scss']
})
export class PayPalModalComponent {

  actionSubscription: Subscription;
  CartSubscription: Subscription;
  cartId$: Observable<string>;
  cardId: string;

  constructor(
    private store: Store<{ cart: CartState }>,
    public dialogRef: MatDialogRef<PayPalModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CartData,
    private firebaseFunctions : FirestoreService,
    private _actions$: Actions) {
      this.cartId$ = store.pipe(select('cart','cartId'));
    }

  ngOnInit() {

    this.CartSubscription = this.cartId$
    .pipe(
      map(x => {
        this.cardId = x;
      })
    )
    .subscribe();

    this.actionSubscription = this._actions$.pipe(ofType(CartActions.SuccessInitializeOrderAction)).subscribe((x) => {
      this.actionSubscription = this.firebaseFunctions.payPalPay(this.data,this.cardId).pipe(
            map((data)=> {
              if (data.code == 200) {
                window.open(data.redirect, 'theFrame', 'location=yes,scrollbars=yes,status=yes');
              }
            }
          )
        ).subscribe();
      });


  }

  ngOnDestroy() {
    this.CartSubscription.unsubscribe();
    this.actionSubscription.unsubscribe();
  }

  onNoClick(): void {
    this.CartSubscription.unsubscribe();
    this.actionSubscription.unsubscribe();
    this.dialogRef.close();
  }

}

export interface CartData {
  cart: any;
  total: number;
}