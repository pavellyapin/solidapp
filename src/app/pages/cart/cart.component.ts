import {Component , OnInit, ChangeDetectorRef} from '@angular/core';
import { Observable, Subscription, forkJoin } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { map } from 'rxjs/operators';
import CartState from 'src/app/services/store/cart/cart.state';
import { Card } from 'src/app/components/cards/card';
import { CartItem } from 'src/app/services/store/cart/cart.model';
import { NavigationService } from 'src/app/services/navigation/navigation.service';
import { Router } from '@angular/router';
import {VariantsPipe} from '../../components/pipes/pipes'
import * as CartActions from '../../services/store/cart/cart.action';
import { Actions, ofType } from '@ngrx/effects';
import { CartService } from './cart.service';
import { UtilitiesService } from 'src/app/services/util/util.service';
import SettingsState from 'src/app/services/store/settings/settings.state';
import { Entry } from 'contentful';
import { ContentfulService } from 'src/app/services/contentful/contentful.service';

@Component({
  selector: 'doo-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {

  //Subscription
  CartSubscription: Subscription;
  OrderSubscription : Subscription;
  CartIdSubscription: Subscription;
  initOrderSubscription: Subscription;
  setShippingSubscription: Subscription;
  setPaymentSubscription: Subscription;
  StripeSuccessSubscription : Subscription;
  SettingsSubscription: Subscription;
  //////////////////////////////////////
  cartId : string;
  cartItems: Array<any>;
  cartItemsCards: Card[] = [];
  cartItemCount: number;

  checkoutStage : string = 'checkout';
  cart$: Observable<CartState>;
  cartItems$: Observable<CartItem[]>;
  order$: Observable<any>;
  
  cartTotal: number;
  primaryTax : number;
  secondaryTax : number;
  shippingCost : number;

  previousUrl : string = '';
  loading:boolean = false;
  settings$: Observable<Entry<any>>;
  siteSettings: Entry<any>;

      constructor(private store: Store<{ cart: CartState , settings : SettingsState }>,
                  private _actions$: Actions,
                  private navService: NavigationService,
                  private router: Router,
                  private cd: ChangeDetectorRef,
                  private variantPipe : VariantsPipe,
                  public cartService : CartService,
                  private utilService: UtilitiesService,
                  private contentfulService: ContentfulService)
        {

          this.settings$ = store.pipe(select('settings','siteConfig'));
          this.cart$ = store.pipe(select('cart'));
          this.cartItems$ = store.pipe(select('cart' , 'items'));
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

    this.SettingsSubscription = this.settings$
    .pipe(
      map(x => {
        this.siteSettings = x;
      })
    )
    .subscribe();
      

    /*this.navService.getPreviousUrl().forEach((segment) => {
      this.previousUrl = this.previousUrl + '/' + segment 
    });*/

    this.CartSubscription = this.cartItems$
    .pipe(
      map(_cartItems => {
        if (!_cartItems || _cartItems.length == 0) {
          this.cartTotal = 0;
          this.store.dispatch(CartActions.SuccessSetOrderTotalAction({ payload: this.cartTotal }));
          this.cartItems = [];
        }
        const requestArray = [];
        _cartItems.forEach((item) => {
          requestArray.push(this.contentfulService.getProductDetails(item.productId));
          }
        )
        forkJoin(requestArray).pipe(
          map((results : any) => {
            this.cartItems = results.map((item)=>({
              ...item,
              cartItem: (
                 _cartItems.filter(cartItem=>{
                  if (item.sys.id == cartItem.productId) {
                    return cartItem;
                  }
                }).pop()
              )
            }));
            this.cartTotal = 0;
            this.cartItems.forEach(item=> {
              this.cartTotal = this.cartTotal + (item.cartItem.qty*(item.fields.discount ? item.fields.discount : item.fields.price));
              
            });
            this.store.dispatch(CartActions.SuccessSetOrderTotalAction({ payload: this.cartTotal.toFixed(2) }));
            this.primaryTax = this.siteSettings.fields.primaryTax? 
                                  parseFloat(((this.siteSettings.fields.primaryTaxValue *  this.cartTotal)/100).toFixed(2))
                                      : undefined;
            this.secondaryTax = this.siteSettings.fields.secondaryTax? 
                                  parseFloat(((this.siteSettings.fields.secondaryTaxValue *  this.cartTotal)/100).toFixed(2))
                                      : undefined;            
          })
        ).subscribe();
        
        this.cartItemCount = 0;
      })
    )
    .subscribe();

    this.CartIdSubscription = this.cart$
    .pipe(
      map(x => {
        this.cartId = x.cartId;
        if (x.shippingMethod) {
          this.shippingCost = x.shippingMethod.fields.price;
          this.cd.detectChanges();
        }
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

  continueToCheckout() {

    this.utilService.scrollTop();

    if  (this.checkoutStage == 'checkout') {
      this.loading = true;
    
      let reqCart = [];
      /*this.cartItemsService.cards.value.forEach(function(item){
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
          }.bind(this));*/

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
    this.SettingsSubscription.unsubscribe();
    this.CartSubscription.unsubscribe();
    this.CartIdSubscription.unsubscribe();
  }

}


