import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Observable, Subscription, forkJoin } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { map } from 'rxjs/operators';
import CartState from 'src/app/services/store/cart/cart.state';
import { Card } from 'src/app/components/cards/card';
import { CartItem } from 'src/app/services/store/cart/cart.model';
import { NavigationService } from 'src/app/services/navigation/navigation.service';
import { Router, NavigationEnd } from '@angular/router';
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
  ResolutionSubscription: Subscription;
  SettingsSubscription: Subscription;
  PagesSubscription: Subscription;
  LoadingSubscription: Subscription;
  UserInfoSubscription: Subscription;
  UserSubscription: Subscription;
  CartStatusSubscription: Subscription;
  RouterSubscription: Subscription;
  GuestFlowSubscription: Subscription;
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

  currentStep: any;
  summaryOpen: boolean = false;
  previousUrl: string = '';
  loading: boolean = true;
  orderStatus: any;
  resolution: any;
  resolution$: Observable<any>;
  settings$: Observable<any>;
  pages$: Observable<any>;
  loading$: Observable<any>;
  siteSettings: Entry<any>;

  constructor(private store: Store<{ cart: CartState, settings: SettingsState, user: UserState }>,
    private _actions$: Actions,
    public navService: NavigationService,
    private router: Router,
    private cd: ChangeDetectorRef,
    private imagePipe: ImagePipe,
    public utilService: UtilitiesService,
    private contentfulService: ContentfulService,
    private seoService: SEOService) {

    this.resolution$ = store.pipe(select('settings', 'resolution'));
    this.settings$ = store.pipe(select('settings', 'siteConfig'));
    this.pages$ = store.pipe(select('settings', 'pages'));
    this.loading$ = store.pipe(select('settings', 'loading'));
    this.shippingMethod$ = store.pipe(select('cart', 'shippingMethod'));
    this.cartId$ = store.pipe(select('cart', 'cartId'));
    this.user$ = store.pipe(select('user'));
    this.cartItems$ = store.pipe(select('cart', 'items'));
    this.order$ = store.pipe(select('cart', 'order'));
  }

  ngOnInit() {
    this.RouterSubscription = this.router.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
        this.initCartStep();
      }
    });

    this.ResolutionSubscription = this.resolution$
      .pipe(
        map(x => {
          this.resolution = x;
        })
      )
      .subscribe();

    this.SettingsSubscription = this.settings$
      .pipe(
        map(x => {
          this.siteSettings = x;
        })
      )
      .subscribe();

    this.PagesSubscription = this.pages$
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

    this.LoadingSubscription = this.loading$
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
          this.userInfo = x.personalInfo;
        })
      )
      .subscribe();



    this.initializeCartState();
    this.initCartStep();

    this.CartStatusSubscription = this._actions$.pipe(ofType(
      CartActions.SuccessSetCartStatusAction,
    )).subscribe(() => {
      this.initializeOrder(this.cartId);
    });

    this.GuestFlowSubscription = this._actions$.pipe(ofType(
      CartActions.SuccessSetGuestFlowAction,
    )).subscribe((x) => {
      if (x.payload) {
        this.initCartStep('shipping', true);
      }
    });

    this.UserInfoSubscription = this._actions$.pipe(ofType(
      //UserActions.SuccessGetUserInfoAction,
      CartActions.SuccessSetOrderShippingAction)).subscribe(() => {
        this.initializeOrder(this.cartId);
      });

    this.initOrderSubscription = this._actions$.pipe(ofType(CartActions.SuccessInitializeOrderAction)).subscribe(() => {
      switch (this.currentStep) {
        case 'guest':
          this.initCartStep('shipping', true);
          break;
        case 'shipping':
          this.initCartStep('payment', true);
          break;
      }
    });

    this.OrderSubscription = this.order$
      .pipe(
        map(x => {
          if (x && x.status) {
            this.orderStatus = x.status;
            if (this.orderStatus == "paid") {
              this.router.navigateByUrl('order/success/' + this.cartId);
            } else if (x.status == "failed") {
              this.router.navigateByUrl('cart/checkout/' + this.cartId + '/error');
            } else if (x.status != "created" && x.status != "retry") {
              this.handleStripeAction(x);
            }
          }
        })
      )
      .subscribe();
  }

  async handleStripeAction(x) {
    await stripe.handleCardAction(
      x.status
    ).then((result) => {
      if (result.error) {
        this.store.dispatch(CartActions.BeginSetCartStatusAction({ payload: { cartId: this.cartId, status: "failed" } }));
      } else {
        this.store.dispatch(CartActions.BeginSetStripeTokenAction({ payload: { cartId: this.cartId, source: { paymentIntent: result.paymentIntent.id } } }));
      }
    });
  }

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
        })
      )
      .subscribe();
  }

  initCartStep(step?, navigate?) {
    if (!this.cartId) {
      return;
    }
    if (!step) {
      this.currentStep = this.navService.getActivePage().title;
    }
    this.store.dispatch(CartActions.BeginGetCartAction({ payload: this.cartId }))
    switch (step ? step : this.currentStep) {
      case 'guest':
        this.summaryOpen = false;
        if (navigate) { this.router.navigateByUrl('cart') }
        break;
      case 'shipping':
        if (!this.utilService.bigScreens.includes(this.resolution)) {
          this.summaryOpen = false
        } else {
          this.summaryOpen = true
        }
        if (navigate) { this.router.navigateByUrl('cart/checkout/' + this.cartId + '/shipping') }
        break;
      case 'payment':
        if (!this.utilService.bigScreens.includes(this.resolution)) {
          this.summaryOpen = false
        } else {
          this.summaryOpen = true
        }
        if (navigate) { 
          this.router.navigateByUrl('cart/checkout/' + this.cartId + '/payment') 
        }
        break;
      case 'Checkout Success':
        this.summaryOpen = false;
        break;
    }
    this.utilService.scrollTop();
  }

  initializeOrder(cartId) {
    let reqCart = [];
    this.cartItems.forEach(function (item) {
      reqCart.push(
        {
          productId: item.productId,
          thumbnail: this.imagePipe.transform(item.product.fields.media[0].fields.file.url),
          name: item.product.fields.title,
          variants: item.variants,
          qty: item.qty,
          price: item.variantPrice || item.variantPrice == 0 ? (item.variantDiscount ? item.variantDiscount : item.variantPrice) : (item.product.fields.discount ?
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
            itemCount: this.cartItemCount,
            total: this.cartTotal.toFixed(2),
            grandTotal: this.grandTotal.toFixed(2)
          }
        }
      }));

  }

  ngOnDestroy() {
    if (this.orderStatus == "paid") {
      this.store.dispatch(CartActions.BeginResetCartAction());
    }
    this.initOrderSubscription.unsubscribe();
    this.ShippingMethodSubscription.unsubscribe();
    this.OrderSubscription.unsubscribe();
    this.SettingsSubscription.unsubscribe();
    this.ResolutionSubscription.unsubscribe();
    this.PagesSubscription.unsubscribe();
    this.LoadingSubscription.unsubscribe();
    this.CartSubscription.unsubscribe();
    this.CartIdSubscription.unsubscribe();
    this.UserInfoSubscription.unsubscribe();
    this.UserSubscription.unsubscribe();
    this.CartStatusSubscription.unsubscribe();
    this.RouterSubscription.unsubscribe();
    this.GuestFlowSubscription.unsubscribe();
  }

}


