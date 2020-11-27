import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
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
import { AuthService } from 'src/app/services/auth/auth.service';
import { SEOService } from 'src/app/services/seo/seo.service';

@Component({
  selector: 'doo-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {

  //Subscription
  CartSubscription: Subscription;
  CartIdSubscription: Subscription;
  ShippingMethodSubscription: Subscription;
  initOrderSubscription: Subscription;
  OrderSubscription: Subscription;
  StripeSuccessSubscription: Subscription;
  SettingsSubscription: Subscription;
  SettingsSubscription2: Subscription;
  SettingsSubscription3: Subscription;
  SettingsSubscription4: Subscription;
  UserInfoSubscription: Subscription;
  UserSubscription: Subscription;
  CartStatusSubscription: Subscription;

  //////////////////////////////////////
  cartId: string;
  cartItems: Array<any>;
  cartItemsCards: Card[] = [];
  cartItemCount: number;

  user$: Observable<UserState>;
  userInfo: UserPerosnalInfo;

  shippingMethod$: Observable<any>;
  cartId$: Observable<any>;
  cartItems$: Observable<CartItem[]>;
  order$: Observable<any>;

  cartTotal: number;
  primaryTax: number;
  secondaryTax: number;
  shippingCost: number = 0;
  grandTotal: Number;

  summaryOpen: boolean = false;
  previousUrl: string = '';
  loading: boolean = true;
  resolution: any;
  settings$: Observable<any>;
  settings2$: Observable<any>;
  settings3$: Observable<any>;
  settings4$: Observable<any>;
  siteSettings: Entry<any>;

  constructor(private store: Store<{ cart: CartState, settings: SettingsState, user: UserState }>,
    private _actions$: Actions,
    public navService: NavigationService,
    private router: Router,
    private cd: ChangeDetectorRef,
    private imagePipe: ImagePipe,
    public utilService: UtilitiesService,
    private contentfulService: ContentfulService,
    private authState: AuthService,
    private seoService: SEOService) {

    this.settings$ = store.pipe(select('settings', 'resolution'));
    this.settings2$ = store.pipe(select('settings', 'siteConfig'));
    this.settings3$ = store.pipe(select('settings', 'pages'));
    this.settings4$ = store.pipe(select('settings', 'loading'));
    this.shippingMethod$ = store.pipe(select('cart', 'shippingMethod'));
    this.cartId$ = store.pipe(select('cart', 'cartId'));
    this.user$ = store.pipe(select('user'));
    this.cartItems$ = store.pipe(select('cart', 'items'));
    this.order$ = store.pipe(select('cart', 'order'));
  }

  ngOnInit() {
    //Subscribe to settings state
    //Listen on loading state for loading screen
    //Get settings object from contentful to determine shipping options etc
    this.SettingsSubscription = this.settings$
      .pipe(
        map(x => {
          this.resolution = x;

          if (this.utilService.bigScreens.includes(this.resolution)) {
            switch (this.navService.getActivePage().title) {
              case 'Checkout Shipping':
                this.summaryOpen = true;
                break;
              case 'Checkout Payment':
                this.summaryOpen = true;
                break;
            }
          }
        })
      )
      .subscribe();

    this.SettingsSubscription2 = this.settings2$
      .pipe(
        map(x => {
          this.siteSettings = x;
        })
      )
      .subscribe();

    this.SettingsSubscription3 = this.settings3$
      .pipe(
        map(x => {
          x.filter(page => {
            if (page.fields.type == 'cart') {
              this.seoService.updateTitle(page.fields.title);
              this.seoService.updateDescription(page.fields.description);
              this.seoService.updateOgUrl(window.location.href);
              return page;
            }
          });
        })
      )
      .subscribe();

    this.SettingsSubscription4 = this.settings4$
      .pipe(
        map(x => {
          this.loading = x;
          this.cd.detectChanges();
        })
      )
      .subscribe();

    this.UserSubscription = this.user$
      .pipe(
        map(x => {
          if ((this.authState.uid && !this.authState.isAnonymous) && !x.uid) {
            this.store.dispatch(UserActions.BeginGetRedirectResultAction());
          }
          this.userInfo = x.personalInfo;
        })
      )
      .subscribe();



    this.initializeCartState();
    /*
    //On Set Status
    */
    this.CartStatusSubscription = this._actions$.pipe(ofType(
      CartActions.SuccessSetCartStatusAction)).subscribe(() => {
        this.initializeOrder(this.cartId);
        this.router.navigateByUrl('cart/checkout/' + this.cartId + '/shipping');
      });

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
      switch (this.navService.getActivePage().title) {
        case 'Checkout Shipping':
          if (this.utilService.bigScreens.includes(this.resolution)) { this.summaryOpen = true }
          this.router.navigateByUrl('cart/checkout/' + this.cartId + '/payment');
          break;
        case 'Checkout':
          if (this.utilService.bigScreens.includes(this.resolution)) { this.summaryOpen = true }
          this.router.navigateByUrl('cart/checkout/' + this.cartId + '/shipping');
          break;
        case 'Checkout Success':
          this.summaryOpen = false;
          break;
      }
      this.utilService.scrollTop();

    });

    //This is for LOGGED IN users, we have a function triggered on insert to {payment}
    //This observable will be updated everytime cart firestore obejct is updated
    this.OrderSubscription = this.order$
      .pipe(
        map(x => {
          if (x && x.status) {
            if (x.status == "paid") {
              this.store.dispatch(CartActions.BeginResetCartAction());
              this.router.navigateByUrl('order/success/' + this.cartId);
            } else if (x.status == "failed") {
              this.router.navigateByUrl('cart/checkout/' + this.cartId + '/error');
            } else if(x.status != "created" && x.status != "retry") {
              this.handleStripeAction(x);
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

  async handleStripeAction(x) {
    await stripe.handleCardAction(
      x.status
    ).then((result)=>{
      if (result.error) {
        this.store.dispatch(CartActions.BeginSetCartStatusAction({ payload: {cartId :this.cartId , status : "failed" } }));
      } else {
        this.store.dispatch(CartActions.BeginSetStripeTokenAction({ payload: { cartId: this.cartId, source: {paymentIntent: result.paymentIntent.id} } }));
      }
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
            this.store.dispatch(CartActions.SuccessSetOrderTotalAction({ payload: this.grandTotal }));
            this.cartItems = [];
          }
          const requestArray = [];
          _cartItems.forEach((item) => {
            requestArray.push(this.contentfulService.getProductDetails(item.productId));
          }
          )
          forkJoin(requestArray).pipe(
            map((results: any) => {
              this.cartItems = _cartItems.map((item) => ({
                ...item,
                product: (
                  results.filter(product => {
                    if (product.sys.id == item.productId) {
                      return product;
                    }
                  }).pop()
                )
              }));
              this.cartTotal = 0;
              this.grandTotal = 0;
              this.cartItemCount = 0;

              this.cartItems.forEach(item => {
                this.cartTotal = this.cartTotal + (item.qty * ((item.variantPrice || item.variantPrice == 0) ? (item.variantDiscount ? item.variantDiscount : item.variantPrice) : (item.product.fields.discount ? item.product.fields.discount : item.product.fields.price)));

              });
              this.primaryTax = this.siteSettings.fields.primaryTax ?
                parseFloat(((this.siteSettings.fields.primaryTaxValue * this.cartTotal) / 100).toFixed(2))
                : 0;
              this.secondaryTax = this.siteSettings.fields.secondaryTax ?
                parseFloat(((this.siteSettings.fields.secondaryTaxValue * this.cartTotal) / 100).toFixed(2))
                : 0;
              this.grandTotal = this.cartTotal + this.shippingCost + this.primaryTax + this.secondaryTax;
              this.store.dispatch(CartActions.SuccessSetOrderTotalAction({ payload: this.grandTotal.toFixed(2) }));
              this.cartItems.forEach(item => {
                this.cartItemCount = this.cartItemCount + item.qty;
              });
            })
          ).subscribe();

        })
      )
      .subscribe();

    this.ShippingMethodSubscription = this.shippingMethod$
      .pipe(
        map(x => {
          if (x) {
            this.shippingCost = x.price;
            this.grandTotal = this.cartTotal + this.shippingCost + this.primaryTax + this.secondaryTax;
            this.cd.detectChanges();
          }
        })
      )
      .subscribe();

    this.CartIdSubscription = this.cartId$
      .pipe(
        map(x => {
          this.cartId = x;
          if (this.cartId) {
            this.store.dispatch(CartActions.BeginGetCartAction({ payload: x }));
          }
        })
      )
      .subscribe();
  }

  initializeOrder(cartId) {
    let reqCart = [];
    this.cartItems.forEach(function (item) {
      reqCart.push(
        {
          product_id: item.productId,
          thumbnail: this.imagePipe.transform(item.product.fields.media[0].fields.file.url),
          name: item.product.fields.title,
          variants: item.variants,
          qty: item.qty,
          price: item.variantPrice ? (item.variantDiscount ? item.variantDiscount : item.variantPrice) : (item.product.fields.discount ?
            item.product.fields.discount :
            item.product.fields.price)
        }
      )
    }.bind(this));
    this.store.dispatch(CartActions.
      BeginInitializeOrderAction({
        payload: {
          cartId: cartId,
          personalInfo: this.userInfo,
          cart: {
            cart: reqCart,
            date: (new Date).getTime(),
            shippingCost: this.shippingCost,
            primaryTax: this.primaryTax,
            secondaryTax: this.secondaryTax,
            total: this.cartTotal.toFixed(2),
            grandTotal: this.grandTotal.toFixed(2)
          }
        }
      }));

  }

  ngOnDestroy() {
    this.initOrderSubscription.unsubscribe();
    this.ShippingMethodSubscription.unsubscribe();
    this.OrderSubscription.unsubscribe();
    this.StripeSuccessSubscription.unsubscribe();
    this.SettingsSubscription.unsubscribe();
    this.SettingsSubscription2.unsubscribe();
    this.SettingsSubscription3.unsubscribe();
    this.SettingsSubscription4.unsubscribe();
    this.CartSubscription.unsubscribe();
    this.CartIdSubscription.unsubscribe();
    this.UserInfoSubscription.unsubscribe();
    this.UserSubscription.unsubscribe();
    this.CartStatusSubscription.unsubscribe();
  }

}


