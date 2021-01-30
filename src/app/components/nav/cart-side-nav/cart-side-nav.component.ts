import {Component, OnInit, Output, EventEmitter, Input} from '@angular/core';
import { Observable, Subscription, BehaviorSubject, forkJoin } from 'rxjs';
import CartState from 'src/app/services/store/cart/cart.state';
import { Store, select } from '@ngrx/store';
import { map } from 'rxjs/operators';
import { CartItem } from 'src/app/services/store/cart/cart.model';
import { ContentfulService } from 'src/app/services/contentful/contentful.service';
import { Card } from '../../cards/card';
import { NavigationService } from 'src/app/services/navigation/navigation.service';
import { Router } from '@angular/router';
import { UtilitiesService } from 'src/app/services/util/util.service';

@Component({
  selector: 'doo-cart-side-nav',
  templateUrl: './cart-side-nav.component.html',
  styleUrls: ['./cart-side-nav.component.scss'],
})
export class CartSideNavComponent implements OnInit {
  
  cartItems$: Observable<CartItem[]>;
  CartSubscription: Subscription;
  cartItemCount:number = 0;
  cartItemsCards: Card[] = [];
  cartItems: Array<any>;
  @Input() resolution:any;
  @Output() expandCartNav = new EventEmitter();
  cards: BehaviorSubject<Card[]> = new BehaviorSubject<Card[]>([]);

  constructor(
    private contentfulService: ContentfulService,
    public navService: NavigationService,
    private router: Router,
    public utilService : UtilitiesService,
    store: Store<{ cart: CartState}>) {
      this.cards.subscribe(cards => {
        this.cartItemsCards = cards;
      });
    this.cartItems$ = store.pipe(select('cart','items'));
  }

  ngOnInit() {

    this.CartSubscription = this.cartItems$
    .pipe(
      map(_cartItems => {
        var cartCount = 0;
        if (!_cartItems || _cartItems.length == 0) {
          this.cartItems = [];
        }
        const requestArray = [];
        _cartItems.forEach((item) => {
          requestArray.push(this.contentfulService.getProductDetails(item.productId));
          }
        )
        if (requestArray.length) {
          forkJoin(requestArray).pipe(
            map((results : any) => {
  
              this.cartItems = _cartItems.map((item)=>({
                ...item,
                product : (
                  results.filter(product=>{
                    if (product && (product.sys.id == item.productId)) {
                      return product;
                    }
                  }).pop()
                )
              }));
              this.cartItems.forEach(item=> {
                  cartCount = cartCount + item.qty;
                });  
                this.cartItemCount = cartCount;
            })
          ).subscribe();
        } else {
          this.cartItemCount = cartCount;
        }

      })
    )
    .subscribe();
  }

  public goToCart() {
    if (!this.cartItemCount) {
        this.expandCartNav.emit();
    } else {
        this.navService.startLoading();
        this.router.navigateByUrl('cart');
    }
  }

  ngOnDestroy(): void {
    this.CartSubscription.unsubscribe();
  }
}
