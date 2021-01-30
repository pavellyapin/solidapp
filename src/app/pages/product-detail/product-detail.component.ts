import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import ProductsState from 'src/app/services/store/product/product.state';
import { Store, select } from '@ngrx/store';
import { map } from 'rxjs/operators';
import { Entry } from 'contentful';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CartItem } from 'src/app/services/store/cart/cart.model';
import * as CartActions from '../../services/store/cart/cart.action';
import * as UserActions from '../../services/store/user/user.action';
import UserState from 'src/app/services/store/user/user.state';
import { FavoriteItem } from 'src/app/services/store/user/user.model';
import SettingsState from 'src/app/services/store/settings/settings.state';
import { NavigationService } from 'src/app/services/navigation/navigation.service';
import { UtilitiesService } from 'src/app/services/util/util.service';
import CartState from 'src/app/services/store/cart/cart.state';
import { SEOService } from 'src/app/services/seo/seo.service';
import { Actions, ofType } from '@ngrx/effects';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'doo-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDeatilComponent implements OnInit {

  //Subscription
  ProductSubscription: Subscription;
  ProductReviewsSubscription: Subscription;
  PagesSubscription: Subscription;
  UserSubscription: Subscription;
  ResolutionSubscription: Subscription;
  SettingsSubscription: Subscription;
  CartIdSubscription: Subscription;
  CartItemsSubscription: Subscription;
  RouterSubscription : Subscription;
  ///////////////

  cart$: Observable<CartState>;
  cartId: string;
  cartItems: Array<any>;

  user$: Observable<UserState>;
  userId: any;

  product$: Observable<Entry<any>>;
  item: any;

  pages$: Observable<Entry<any>[]>;
  productReviews$: Observable<any[]>;
  resolution$: Observable<string>;
  siteConfig$: Observable<Entry<any>>;
  productDetails: Entry<any>;
  productReviews: any[];
  pageLayout: Entry<any>;
  isFavorite: FavoriteItem;
  cartItemForm: FormGroup;
  formSubmit = false;
  productVariants: Map<string, [any]> = new Map();
  variantPrice: any;
  variantDiscount: any;
  displayedMediaIndex: number = 0;
  resolution: any;
  siteConfig: any;
  sitePages: Entry<any>[];


  constructor(private navService: NavigationService,
    private utilService: UtilitiesService,
    private seoService: SEOService,
    private _actions$: Actions,
    private router: Router,
    private cd : ChangeDetectorRef,
    private store: Store<{
      products: ProductsState,
      user: UserState,
      cart: CartState,
      settings: SettingsState
    }>) {

    this.product$ = store.pipe(select('products', 'productDetails'));
    this.productReviews$ = store.pipe(select('products', 'reviews'));

    this.user$ = store.pipe(select('user'));
    this.pages$ = store.pipe(select('settings', 'pages'));

    this.cart$ = store.pipe(select('cart'));

    this.resolution$ = store.pipe(select('settings', 'resolution'));

    this.siteConfig$ = store.pipe(select('settings', 'siteConfig'));
  }

  ngOnInit() {

    this.RouterSubscription = this.router.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
        this.getProductDetail();
      }
    });

    this.CartItemsSubscription = this._actions$.pipe(ofType(
      CartActions.SuccessBackGroundInitializeOrderAction)).subscribe((result) => {
        this.store.dispatch(CartActions.BeginAddProductToCartAction({ payload: this.item }));
      });


    this.CartIdSubscription = this.cart$
      .pipe(
        map(x => {
          this.cartId = x.cartId;
          this.cartItems = x.items;
        })
      )
      .subscribe();

    this.ProductSubscription = this.product$
      .pipe(
        map(x => {
          this.productDetails = x;
          this.seoService.updateTitle(this.productDetails.fields.title);
          this.seoService.updateDescription(this.productDetails.fields.title);
          this.seoService.updateOgUrl(window.location.href);
          this.sortVariants();
        })
      )
      .subscribe();

    this.ProductReviewsSubscription = this.productReviews$
      .pipe(
        map(x => {
          this.productReviews = x;
        })
      )
      .subscribe();

    this.PagesSubscription = this.pages$
      .pipe(
        map(x => {
          this.sitePages = x;
          this.getProductDetail();
        })
      )
      .subscribe();

    this.UserSubscription = this.user$
      .pipe(
        map(x => {
          this.isFavorite = undefined;
          if (x.favorites) {
            x.favorites.forEach(element => {
              if (this.productDetails.sys.id == element.product.productId) {
                this.isFavorite = element;
                return
              }
            });
          }
          this.userId = x.uid;

        })
      )
      .subscribe();

    this.ResolutionSubscription = this.resolution$
      .pipe(
        map(x => {
          this.resolution = x;
        })
      )
      .subscribe();

    this.SettingsSubscription = this.siteConfig$
      .pipe(
        map(x => {
          this.siteConfig = x;
        })
      )
      .subscribe();
  }

  initForm() {
    this.cartItemForm = new FormGroup({
      size: new FormControl(''),
      color: new FormControl(''),
      support: new FormControl(''),
      duration: new FormControl(''),
      occupancy: new FormControl(''),
      facilitation: new FormControl(''),
      qty: new FormControl(1, Validators.required)
    });
    this.productVariants = new Map();
  }

  getProductDetail() {
    this.navService.startLoading();
    this.pageLayout = null;
    this.cd.detectChanges();
    this.pageLayout = this.sitePages.filter(page => {
      if (page.fields.type == "product") {
        return page;
      }
    }).pop();
    this.navService.finishLoading();
  }

  variantPriceChange($event) {
    this.productVariants.forEach((variantGroup) => {
      variantGroup.forEach((variant) => {
        if ($event.value == variant["name"]) {
          this.variantPrice = variant["price"];
          this.variantDiscount = variant["discount"];
        }
      })
    });
  }



  addProductToCart() {
    this.utilService.scrollTop();
    if (this.cartItemForm.valid) {
      this.item = new CartItem();
      this.item.variants = {}
      this.item.productId = this.productDetails.sys.id;
      this.item.qty = Number(this.cartItemForm.controls["qty"].value);


      if (this.cartItemForm.controls["size"].value != '') {
        this.item.variants.size = this.cartItemForm.controls["size"].value;
      }
      if (this.cartItemForm.controls["support"].value != '') {
        this.item.variants.support = this.cartItemForm.controls["support"].value;
      }

      if (this.cartItemForm.controls["color"].value != '') {
        this.item.variants.color = this.cartItemForm.controls["color"].value;
      }

      if (this.cartItemForm.controls["duration"].value != '') {
        this.item.variants.duration = this.cartItemForm.controls["duration"].value;
      }

      if (this.cartItemForm.controls["occupancy"].value != '') {
        this.item.variants.occupancy = this.cartItemForm.controls["occupancy"].value;
      }

      if (this.cartItemForm.controls["facilitation"].value != '') {
        this.item.variants.facilitation = this.cartItemForm.controls["facilitation"].value;
      }

      if (this.variantPrice || this.variantPrice == 0) {
        this.item.variantPrice = this.variantPrice;
      }

      if (this.variantDiscount || this.variantDiscount == 0) {
        this.item.variantDiscount = this.variantDiscount;
      }

      let reqCart = [];
      this.cartItems.forEach(function (item) {
        reqCart.push(
          {
            product_id: item.productId,
            qty: item.qty
          }
        )
      }.bind(this));

      reqCart.push(
        {
          product_id: this.item.productId,
          qty: this.item.qty
        }
      );

      this.store.dispatch(CartActions.
        BeginBackGroundInitializeOrderAction({
          payload: {
            cartId: this.cartId,
            cart: { cart: reqCart }
          }
        }));
    } else {
      this.formSubmit = true;
    }
  }

  sortVariants() {
    this.initForm();
    if (this.productDetails.fields.variants) {
      this.productDetails.fields.variants.forEach(variant => {
        if (this.cartItemForm.controls[variant.fields.option]) {
          this.cartItemForm.controls[variant.fields.option].setValidators(Validators.required)
        }
        if (this.productVariants.get(variant.fields.option)) {
          this.productVariants.get(variant.fields.option)
            .push({ name: variant.fields.name, code: variant.fields.code, price: variant.fields.price, discount: variant.fields.discount, type: variant.fields.option });
        } else {
          if (variant.fields.price || variant.fields.price == 0) {
            this.variantPrice = variant.fields.price;
          }
          if (variant.fields.discount || variant.fields.discount == 0) {
            this.variantDiscount = variant.fields.discount;
          }
          this.productVariants.set(variant.fields.option,
            [{ name: variant.fields.name, code: variant.fields.code, price: variant.fields.price, discount: variant.fields.discount, type: variant.fields.option, checked: true }]);
          if (this.cartItemForm.controls[variant.fields.option]) {
            this.cartItemForm.controls[variant.fields.option].setValue(variant.fields.name);
          }
        }
      });
    }
  }



  favoriteToggle($event) {
    if (!$event) {
      this.store.dispatch(UserActions.BeginAddToFavoritesAction({ payload: this.productDetails.sys.id }));
    } else {
      this.store.dispatch(UserActions.BeginRemoveFromFavoritesAction({ payload: this.isFavorite.docId }));
    }
  }

  changeImage(index) {
    this.displayedMediaIndex = index;
  }

  addQty() {
    this.cartItemForm.controls["qty"].setValue(this.cartItemForm.controls["qty"].value + 1);
  }

  removeQty() {
    if (this.cartItemForm.controls["qty"].value > 1) {
      this.cartItemForm.controls["qty"].setValue(this.cartItemForm.controls["qty"].value - 1);
    }
  }

  ngOnDestroy() {
    this.ProductSubscription.unsubscribe();
    this.ProductReviewsSubscription.unsubscribe();
    this.UserSubscription.unsubscribe();
    this.PagesSubscription.unsubscribe();
    this.ResolutionSubscription.unsubscribe();
    this.SettingsSubscription.unsubscribe();
    this.CartItemsSubscription.unsubscribe();
    this.RouterSubscription.unsubscribe();
  }

}
