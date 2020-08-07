import {Component , OnInit, ChangeDetectorRef} from '@angular/core';
import { Observable, Subscription, forkJoin } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { map } from 'rxjs/operators';
import CartState from 'src/app/services/store/cart/cart.state';
import { Card } from 'src/app/components/cards/card';
import { CartItem } from 'src/app/services/store/cart/cart.model';
import { NavigationService } from 'src/app/services/navigation/navigation.service';
import { Router } from '@angular/router';
import * as CartActions from '../../services/store/cart/cart.action';
import { Actions, ofType } from '@ngrx/effects';
import { UtilitiesService } from 'src/app/services/util/util.service';
import SettingsState from 'src/app/services/store/settings/settings.state';
import { Entry } from 'contentful';
import { ContentfulService } from 'src/app/services/contentful/contentful.service';
import * as UserActions from 'src/app/services/store/user/user.action';
import UserState from 'src/app/services/store/user/user.state';
import { UserPerosnalInfo } from 'src/app/services/store/user/user.model';
import { ImagePipe } from 'src/app/components/pipes/pipes';

@Component({
  selector: 'doo-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {

  //Subscription
  CartSubscription: Subscription;
  CartIdSubscription: Subscription;
  initOrderSubscription: Subscription;
  OrderSubscription : Subscription;
  StripeSuccessSubscription : Subscription;
  SettingsSubscription: Subscription;
  UserInfoSubscription : Subscription;
  UserSubscription: Subscription;
    
  //////////////////////////////////////
  cartId : string;
  cartItems: Array<any>;
  cartItemsCards: Card[] = [];
  cartItemCount: number;

  user$: Observable<UserState>;
  userInfo: UserPerosnalInfo;

  cart$: Observable<CartState>;
  cartItems$: Observable<CartItem[]>;
  order$: Observable<any>;
  
  cartTotal: number;
  primaryTax : number;
  secondaryTax : number;
  shippingCost : number = 0;
  grandTotal : Number;

  summaryOpen : boolean = false;
  previousUrl : string = '';
  loading:boolean = false;
  resolution:any;
  bigScreens = new Array('lg' , 'xl' , 'md')
  settings$: Observable<SettingsState>;
  siteSettings: Entry<any>;

      constructor(private store: Store<{ cart: CartState , settings : SettingsState , user: UserState }>,
                  private _actions$: Actions,
                  public navService: NavigationService,
                  private router: Router,
                  private cd: ChangeDetectorRef,
                  private imagePipe : ImagePipe,
                  public utilService: UtilitiesService,
                  private contentfulService: ContentfulService)
        {

          this.settings$ = store.pipe(select('settings'));
          this.cart$ = store.pipe(select('cart'));
          this.user$ = store.pipe(select('user'));
          this.cartItems$ = store.pipe(select('cart' , 'items'));
          this.order$ = store.pipe(select('cart' , 'order'));
        }

  ngOnInit() {

    //Subscribe to settings state
    //Listen on loading state for loading screen
    //Get settings object from contentful to determine shipping options etc
    this.SettingsSubscription = this.settings$
    .pipe(
      map(x => {
        this.siteSettings = x.siteConfig;
        this.loading = x.loading;
        this.resolution = x.resolution;
      })
    )
    .subscribe();

    this.UserSubscription = this.user$
    .pipe(
      map(x => {
        this.userInfo = x.personalInfo;
      })
    )
    .subscribe();

    switch(this.navService.getActivePage().title) {
      case 'Checkout Shipping':
          this.summaryOpen = true;
          break;
      case 'Checkout Payment':
          this.summaryOpen = true;
          break;
      case 'Checkout Success':
          this.summaryOpen = false;
          break;
    }

    this.initializeCartState();

    /*
    //Everytime user updates address or personal info we want to initialize the order
    //We are reusing the same function so container does not sleep
    */
    this.UserInfoSubscription = this._actions$.pipe(ofType(
      UserActions.SuccessGetUserInfoAction,
      CartActions.SuccessSetOrderShippingAction)).subscribe(() => {
      this.initializeOrder(this.cartId);
    });

    //After every time init of order is successful we want to navigate to the next checkout step
    //First step is guest page, or if user logged in first is shipping
    this.initOrderSubscription = this._actions$.pipe(ofType(CartActions.SuccessInitializeOrderAction)).subscribe(() => {
      switch(this.navService.getActivePage().title) {
        case 'Checkout Shipping':
          this.summaryOpen = true;
          this.router.navigateByUrl('cart/checkout/' + this.cartId +'/payment');
            break;
        case 'Checkout':
          this.summaryOpen = true;
          this.router.navigateByUrl('cart/checkout/' + this.cartId +'/shipping');
            break;
        case 'Checkout Success':
            this.summaryOpen = false;
            break;
      }
      this.utilService.scrollTop();
      this.navService.finishLoading();
      });

      //This is for LOGGED IN users, we have a function triggered on insert to {payment}
      //This observable will be updated everytime cart firestore obejct is updated
      this.OrderSubscription = this.order$
      .pipe(
        map(x => {
          if (x) {
            if (x.status =="paid") {
              this.store.dispatch(CartActions.BeginResetCartAction());
              this.router.navigateByUrl('order/success/' + this.cartId);
            }
          }
        })
      )
      .subscribe();

      //This is for GUEST users, we are waiting for a function return when stripe is successful
      this.StripeSuccessSubscription = this._actions$.pipe(ofType(CartActions.SuccessStripePaymentAction)).subscribe(() => {
            this.store.dispatch(CartActions.BeginResetCartAction());
            this.router.navigateByUrl('order/success/' + this.cartId);
      });
  }

  /* Connecting to cart state to fetch all current cart item, using a forkJoin we call contentful seperatly for each product
  // This way price is always real.
  // We are joining cart item info like variants choses to contentful object
  // Here we are also calculating  << cartTotal >>
  */
  initializeCartState() {
    this.CartSubscription = this.cartItems$
    .pipe(
      map(_cartItems => {
        if (!_cartItems || _cartItems.length == 0) {
          this.cartTotal = 0;
          this.grandTotal = 0;
          this.primaryTax = 0;
          this.secondaryTax = 0;
          this.cartItemCount = 0;
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
            this.grandTotal = 0;
            this.cartItemCount = 0;

            this.cartItems.forEach(item=> {
              this.cartTotal = this.cartTotal + (item.cartItem.qty*(item.fields.discount ? item.fields.discount : item.fields.price));
              
            });
            this.primaryTax = this.siteSettings.fields.primaryTax? 
                                  parseFloat(((this.siteSettings.fields.primaryTaxValue *  this.cartTotal)/100).toFixed(2))
                                      : undefined;
            this.secondaryTax = this.siteSettings.fields.secondaryTax? 
                                  parseFloat(((this.siteSettings.fields.secondaryTaxValue *  this.cartTotal)/100).toFixed(2))
                                      : undefined;   
            this.grandTotal = this.cartTotal + this.shippingCost + this.primaryTax + this.secondaryTax;  
            this.store.dispatch(CartActions.SuccessSetOrderTotalAction({ payload: this.grandTotal.toFixed(2) }));
            this.cartItems.forEach(item=> {
              this.cartItemCount = this.cartItemCount + item.cartItem.qty;
            });   
          })
        ).subscribe();
        
      })
    )
    .subscribe();

    this.CartIdSubscription = this.cart$
    .pipe(
      map(x => {
        this.cartId = x.cartId;
        if (x.shippingMethod) {
          this.shippingCost = x.shippingMethod.fields.price;
          this.grandTotal = this.cartTotal + this.shippingCost + this.primaryTax + this.secondaryTax;  
          this.cd.detectChanges();
        }
      })
    )
    .subscribe();
  }

  ngAfterViewInit() {
    
    this.navService.finishLoading();
  }

  initializeOrder(cartId) {
    let reqCart = [];
    this.cartItems.forEach(function(item){
          reqCart.push(
            {product_id : item.cartItem.productId,
            thumbnail : this.imagePipe.transform(item.fields.media[0].fields.file.url),
            name : item.fields.title,
            variants : item.cartItem.variants,
            qty : item.cartItem.qty,
            price : item.fields.discount ? 
                    item.fields.discount : 
                    item.fields.price }
          )
        }.bind(this));
         this.store.dispatch(CartActions.
              BeginInitializeOrderAction({payload :{cartId : cartId, 
                                                    personalInfo : this.userInfo ,
                                                    cart : {cart : reqCart ,
                                                            date : (new Date).getTime(),
                                                            shippingCost : this.shippingCost,
                                                            primaryTax : this.primaryTax, 
                                                            secondaryTax : this.secondaryTax,
                                                            total : this.cartTotal.toFixed(2),
                                                            grandTotal : this.grandTotal.toFixed(2)}
                                                  }}));
    
  }

  ngOnDestroy(){
    this.initOrderSubscription.unsubscribe();
    this.OrderSubscription.unsubscribe();
    this.StripeSuccessSubscription.unsubscribe();
    this.SettingsSubscription.unsubscribe();
    this.CartSubscription.unsubscribe();
    this.CartIdSubscription.unsubscribe();
    this.UserInfoSubscription.unsubscribe();
    this.UserSubscription.unsubscribe();
  }

}


