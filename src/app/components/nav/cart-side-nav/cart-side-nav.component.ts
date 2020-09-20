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
        this.cartItemCount = 0;
        if (!_cartItems || _cartItems.length == 0) {
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
            this.cartItems.forEach(item=> {
                this.cartItemCount = this.cartItemCount + item.cartItem.qty;
              });  
          })
        ).subscribe();
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
