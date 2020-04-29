import {Component , OnInit, Inject} from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { map } from 'rxjs/operators';
import CartState from 'src/app/services/store/cart/cart.state';
import { Card } from 'src/app/components/cards/card';
import { CartItem } from 'src/app/services/store/cart/cart.model';
import { ContentfulService } from 'src/app/services/contentful/contentful.service';
import { NavigationService } from 'src/app/services/navigation/navigation.service';
import { Router } from '@angular/router';
import { FirestoreService } from 'src/app/services/firestore/firestore.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import {VariantsPipe} from '../../components/pipes/pipes'
import * as CartActions from '../../services/store/cart/cart.action';
import { Actions, ofType } from '@ngrx/effects';
import { CartCardsService } from './cart-cards/product-cards.service';

@Component({
  selector: 'doo-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {

  checkoutStage : string = 'checkout';
  cart$: Observable<CartState>;
  CartSubscription: Subscription;
  actionSubscription: Subscription;
  cartId : string;
  cartItems: Array<CartItem>;
  cartItemsCards: Card[] = [];
  cartItemCount: number;
  cartTotal: number;
  previousUrl : string = '';

      constructor(private store: Store<{ cart: CartState }>,
                  private _actions$: Actions,
                  private cartItemsService: CartCardsService,
                  private navService: NavigationService,
                  private contentfulService: ContentfulService,
                  private router: Router,
                  private dialog: MatDialog,
                  private variantPipe : VariantsPipe)
        {

          this.cart$ = store.pipe(select('cart'));
        }

  ngOnInit() {

    if (this.router.routerState.snapshot.url == '/cart/checkout/shipping') {
      this.checkoutStage = 'shipping';
    }

    this.navService.getPreviousUrl().forEach((segment) => {
      this.previousUrl = this.previousUrl + '/' + segment 
    });

    this.CartSubscription = this.cart$
    .pipe(
      map(x => {
        this.cartId = x.cartId;
        this.cartItems = x.items;
        this.cartItemCount = 0;
        this.cartItems.forEach((item)=>{
          this.cartItemCount = this.cartItemCount + item.qty;
        })
        this.calculateTotal();
      })
    )
    .subscribe();

    this.actionSubscription = this._actions$.pipe(ofType(CartActions.SuccessInitializeOrderAction)).subscribe(() => {
        this.checkoutStage = 'shipping';
        this.router.navigateByUrl('cart/checkout/shipping');    
      });
  }

  calculateTotal(): void {
    this.cartTotal = 0;
    this.cartItems.forEach((v,index) => {
        this.contentfulService.getProductDetails(v.productId).forEach(
          x => {
            this.cartTotal = this.cartTotal + (v.qty*(x.fields.discount ? x.fields.discount : x.fields.price));
            x.fields.variants = v.variants;
            x.fields.qty = v.qty;
          }
        )

      }
    );
  }

  continueToCheckout() {
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

    this.store.dispatch(CartActions.BeginInitializeOrderAction({payload :{cartId : this.cartId, cart : {cart : reqCart , total : this.cartTotal.toFixed(2)}}}));

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
    if (this.checkoutStage == 'shipping') {
      this.checkoutStage = 'checkout';
      this.router.navigateByUrl('/cart');
    } else {
      this.navService.resetStack([]);
      this.router.navigateByUrl(this.previousUrl);
    }
  }

  ngOnDestroy(){
    this.actionSubscription.unsubscribe();
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