import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateChild,CanDeactivate, RouterStateSnapshot, UrlTree, Router, CanActivate, } from '@angular/router';
import { Observable, Subscription, forkJoin } from 'rxjs';
import { NavigationService } from "./navigation.service";
import { sideNavPath } from "./nav-routing";
import { map } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/auth';
import { UtilitiesService } from '../util/util.service';
import { Store, select } from '@ngrx/store';
import CartState from '../store/cart/cart.state';
import SettingsState from '../store/settings/settings.state';
import { CartItem } from '../store/cart/cart.model';
import { Actions, ofType } from '@ngrx/effects';
import * as CartActions from '../../services/store/cart/cart.action';
import { ContentfulService } from '../contentful/contentful.service';
import { Entry } from 'contentful';

@Injectable({
  providedIn: 'root',
})
export class NavGuard implements CanActivate, CanActivateChild , CanDeactivate<any> {

  cartItems$: Observable<CartItem[]>;
  CartItemsSubscription: Subscription;
  settings$: Observable<any>;
  initOrderSubscription: Subscription;
  SettingsSubscription: Subscription;
  cartTotal: number;
  primaryTax: number;
  secondaryTax: number;
  shippingCost: number = 0;
  grandTotal: Number;
  cartItemCount: number;
  _cartItems: Array<any>;
  cartItems: Array<any>;
  siteSettings: Entry<any>;
  CartIdSubscription: Subscription;
  cart$: Observable<CartState>;
  cartId: string;

  constructor(private store: Store<{ cart: CartState, settings: SettingsState }>,
    private navigationService: NavigationService,
    private _actions$: Actions,
    public afAuth: AngularFireAuth,
    private utils: UtilitiesService,
    private router: Router,
    private contentfulService: ContentfulService) {
    this.settings$ = store.pipe(select('settings', 'siteConfig'));
    this.cartItems$ = store.pipe(select('cart', 'items'));
    this.cart$ = store.pipe(select('cart'));
  }

  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {

    return this.afAuth.authState.pipe(map((auth) => {
      this.utils.scrollTop();

      if (childRoute.data && childRoute.data.title) {
        const parentPath: string = childRoute.parent.url
          .map(url => url.path)
          .join('/');

        if (parentPath === sideNavPath) {
          this.navigationService.selectNavigationItemByPath(
            childRoute.url.map(url => url.path).join('/'),
          );
        }

        this.navigationService.setActivePage(
          childRoute.data.title,
          childRoute.url.map(url => url.path),
          childRoute.data.isChild,
        );
      }
      return true;
    }));

  }

  canActivate() {
    this.SettingsSubscription = this.settings$
      .pipe(
        map(x => {
          this.siteSettings = x;
        })
      )
      .subscribe();

      this.CartIdSubscription = this.cart$
      .pipe(
        map(x => {
          this.cartId = x.cartId;
        })
      )
      .subscribe();

      this.CartItemsSubscription = this.cartItems$
      .pipe(
        map(x => {
          this._cartItems = x;
        })
      )
      .subscribe();

    this.initOrderSubscription = this._actions$.pipe(ofType(CartActions.BeginBackGroundInitializeCartAction)).subscribe((result) => {
      this.cartTotal = 0;
      this.grandTotal = 0;
      this.primaryTax = 0;
      this.secondaryTax = 0;
      this.cartItemCount = 0;
      this.cartItems = [];
      const requestArray = [];
      if(result.payload.cart) {
        result.payload.cart.cart.forEach((item) => {
          requestArray.push(this.contentfulService.getProductDetails(item.productId));
        });
      } else {
        this._cartItems.forEach((item) => {
          requestArray.push(this.contentfulService.getProductDetails(item.productId));
        });
      }
      forkJoin(requestArray).pipe(
        map((results: any) => {
          if (result.payload.cart) {
            this.cartItems = result.payload.cart.cart.map((item) => ({
              ...item,
              product: (
                results.filter(product => {
                  if (product.sys.id == item.productId) {
                    return product;
                  }
                }).pop()
              )
            }));
          } else {
            this.cartItems = this._cartItems.map((item) => ({
              ...item,
              product: (
                results.filter(product => {
                  if (product.sys.id == item.productId) {
                    return product;
                  }
                }).pop()
              )
            }));
          }

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

          let reqCart = [];
          this.cartItems.forEach(function (item) {
            reqCart.push(
              {
                productId: item.productId,
                thumbnail: 'https:' + item.product.fields.media[0].fields.file.url,
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
            BeginBackGroundInitializeOrderAction({
              payload: {
                cartId: this.cartId,
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
        })
      ).subscribe();
    });
    
    return true;
  }

  canDeactivate() {
    this.initOrderSubscription.unsubscribe();
    this.SettingsSubscription.unsubscribe();
    this.CartIdSubscription.unsubscribe();
    this.CartItemsSubscription.unsubscribe();
    return true;
  }
}
