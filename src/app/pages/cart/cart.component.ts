import {Component , OnInit} from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { map } from 'rxjs/operators';
import CartState from 'src/app/services/store/cart/cart.state';
import { Card } from 'src/app/components/cards/card';
import { CartItem } from 'src/app/services/store/cart/cart.model';
import { ContentfulService } from 'src/app/services/contentful/contentful.service';
import { NavigationService } from 'src/app/services/navigation/navigation.service';
import { Router } from '@angular/router';
import {VariantsPipe} from '../../components/pipes/pipes'
import * as CartActions from '../../services/store/cart/cart.action';
import { Actions, ofType } from '@ngrx/effects';
import { CartCardsService } from './cart-cards/product-cards.service';
import { CartService } from './cart.service';
import { UtilitiesService } from 'src/app/services/util/util.service';

@Component({
  selector: 'doo-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {

  checkoutStage : string = 'checkout';
  cartId$: Observable<string>;
  cart$: Observable<CartItem[]>;
  order$: Observable<any>;
  CartSubscription: Subscription;
  OrderSubscription : Subscription;
  CartIdSubscription: Subscription;
  initOrderSubscription: Subscription;
  setShippingSubscription: Subscription;
  setPaymentSubscription: Subscription;
  StripeSuccessSubscription : Subscription;
  cartId : string;
  cartItems: Array<CartItem>;
  cartItemsCards: Card[] = [];
  cartItemCount: number;
  cartTotal: number;
  previousUrl : string = '';
  loading:boolean = false;

      constructor(private store: Store<{ cart: CartState }>,
                  private _actions$: Actions,
                  private cartItemsService: CartCardsService,
                  private navService: NavigationService,
                  private contentfulService: ContentfulService,
                  private router: Router,
                  private variantPipe : VariantsPipe,
                  private cartService : CartService,
                  private utilService: UtilitiesService)
        {


          this.cartId$ = store.pipe(select('cart' , 'cartId'));
          this.cart$ = store.pipe(select('cart' , 'items'));
          this.order$ = store.pipe(select('cart' , 'order'));
        }

  ngOnInit() {

    switch(this.router.routerState.snapshot.url) {
      case '/cart/checkout/shipping':
          this.checkoutStage = 'shipping';
          break;
      case '/cart/checkout/payment':
          this.checkoutStage = 'payment';
          break;
    }
      

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
        this.calculateTotal();
      })
    )
    .subscribe();

    this.CartIdSubscription = this.cartId$
    .pipe(
      map(x => {
        this.cartId = x;
      })
    )
    .subscribe();

    this.OrderSubscription = this.order$
    .pipe(
      map(x => {
        if (x) {
          if (x.status =="paid") {
            this.store.dispatch(CartActions.BeginResetCartAction());
            this.router.navigateByUrl('cart/checkout/success/' + this.cartId);
            this.loading = false;
          }
        }
        //this.cartId = x;
      })
    )
    .subscribe();

    this.initOrderSubscription = this._actions$.pipe(ofType(CartActions.SuccessInitializeOrderAction)).subscribe(() => {
        this.checkoutStage = 'shipping';
        this.router.navigateByUrl('cart/checkout/shipping');  
        this.loading = false;  
      });

      this.setShippingSubscription = this._actions$.pipe(ofType(CartActions.SuccessSetOrderShippingAction)).subscribe(() => {
        this.checkoutStage = 'payment';
        this.router.navigateByUrl('cart/checkout/payment');  
        this.loading = false;  
      });

      //This is for logged in user, another listener on cart status "paid"
      this.setPaymentSubscription = this._actions$.pipe(ofType(CartActions.BeginSetStripeTokenAction)).subscribe(() => {
        this.loading = true;  
      });

      this.StripeSuccessSubscription = this._actions$.pipe(ofType(CartActions.SuccessStripePaymentAction)).subscribe(() => {
            this.store.dispatch(CartActions.BeginResetCartAction());
            this.router.navigateByUrl('cart/checkout/success/' + this.cartId);
            this.loading = false;  
      });

      
  }

  ngAfterViewInit() {
    this.navService.finishLoading();
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

    this.utilService.scrollTop();

    if  (this.checkoutStage == 'checkout') {
      this.loading = true;
    
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
    } else if (this.checkoutStage == 'shipping') {
      this.loading = true;
      this.cartService.emitShippingChange('change');
    } else if (this.checkoutStage == 'payment') {
      this.cartService.emitPaymentChange('change');
    }

  }


  navigateToPrevious() {
    if (this.checkoutStage == 'shipping') {
      this.checkoutStage = 'checkout';
      this.router.navigateByUrl('/cart');
    } else if (this.checkoutStage == 'payment') {
      this.checkoutStage = 'shipping';
      this.router.navigateByUrl('/cart/checkout/shipping');
    } else {
      this.navService.resetStack(['cart']);
      this.router.navigateByUrl(this.previousUrl);
    }
  }

  ngOnDestroy(){
    this.initOrderSubscription.unsubscribe();
    this.setShippingSubscription.unsubscribe();
    this.setPaymentSubscription.unsubscribe();
    this.StripeSuccessSubscription.unsubscribe();
    this.CartSubscription.unsubscribe();
    this.CartIdSubscription.unsubscribe();
    this.cartItemsService.resetCards();
    
  }

}


