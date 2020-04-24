import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {NavigationService, Page} from '../../services/navigation/navigation.service';
import {NavRoute} from '../../services/navigation/nav-routing';
import {AuthService} from '../../services/auth/auth.service';
import { Observable, Subscription } from 'rxjs';
import SettingsState from 'src/app/services/store/settings/settings.state';
import CartState from 'src/app/services/store/cart/cart.state';
import { Store, select } from '@ngrx/store';
import { map, startWith } from 'rxjs/operators';
import { Entry } from 'contentful';
import { sortBanners } from '../pipes/pipes';
import { CartCardsService } from './cart-cards/product-cards.service';
import { Card } from '../cards/card';
import { MediaObserver } from '@angular/flex-layout';
import { CartItem } from 'src/app/services/store/cart/cart.model';
import { ContentfulService } from 'src/app/services/contentful/contentful.service';
import { CartCardComponent } from './cart-cards/cart-card/cart-card.component';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
})
export class NavComponent implements OnInit {
  
  isOpen:boolean = false;
  isClosing:boolean = false;
  mainMenuOpen = false;
  settings$: Observable<SettingsState>;
  SettingsSubscription: Subscription;
  cart$: Observable<CartState>;
  CartSubscription: Subscription;
  siteSettings: Entry<any>;
  categories: Entry<any>[];
  rootCategories: Entry<any>[];
  cartItemCount:number = 0;
  cartItemsCards: Card[] = [];
  cartItems: Array<CartItem>;
  cols: Observable<number>;
  colsBig: Observable<number>;
  rowsBig: Observable<number>;


  constructor(
    private router: Router,
    private authService: AuthService,
    private mediaObserver: MediaObserver,
    private contentfulService: ContentfulService,
    private cartItemsService: CartCardsService,
    store: Store<{ settings: SettingsState , cart: CartState}>,
    private navService: NavigationService) {
      this.cartItemsService.cards.subscribe(cards => {
        this.cartItemsCards = cards;
      });
    this.settings$ = store.pipe(select('settings'));
    this.cart$ = store.pipe(select('cart'));
  }

  ngOnInit() {
    this.SettingsSubscription = this.settings$
    .pipe(
      map(x => {
        this.siteSettings = x.siteConfig;
        this.categories = x.categories;
        this.rootCategories = this.categories ? this.categories.
        filter(item => item.fields.root == true).sort(sortBanners) : this.categories;
      })
    )
    .subscribe();

    this.CartSubscription = this.cart$
    .pipe(
      map(x => {
        if (x.items) {
          this.cartItems = x.items
          this.cartItemCount = 0;
          this.cartItems.forEach((item)=>{
            this.cartItemCount = this.cartItemCount + item.qty; 
          })
          this.cartItemsService.resetCards();
          this.createCards();
          this.toggleSideNav();
        }
      })
    )
    .subscribe();

     /* Grid column map */
     const colsMap = new Map([
      ['xs', 1],
      ['sm', 4],
      ['md', 8],
      ['lg', 8],
      ['xl', 8],
    ]);
    /* Big card column span map */
    const colsMapBig = new Map([
      ['xs', 1],
      ['sm', 4],
      ['md', 8],
      ['lg', 8],
      ['xl', 8],
    ]);
    /* Small card column span map */
    const rowsMapBig = new Map([
      ['xs', 4],
      ['sm', 4],
      ['md', 4],
      ['lg', 5],
      ['xl', 4],
    ]);
    let startCols: number;
    let startColsBig: number;
    let startRowsBig: number;
    colsMap.forEach((cols, mqAlias) => {
      if (this.mediaObserver.isActive(mqAlias)) {
        startCols = cols;
      }
    });
    colsMapBig.forEach((cols, mqAlias) => {
      if (this.mediaObserver.isActive(mqAlias)) {
        startColsBig = cols;
      }
    });
    rowsMapBig.forEach((rows, mqAliast) => {
      if (this.mediaObserver.isActive(mqAliast)) {
        startRowsBig = rows;
      }
    });
    const media$ = this.mediaObserver.asObservable();
    this.cols = media$.pipe(
      map(change => {
        return colsMap.get(change[0].mqAlias);
      }),
      startWith(startCols),
    );
    this.colsBig = media$.pipe(
      map(change => {
        return colsMapBig.get(change[0].mqAlias);
      }),
      startWith(startColsBig),
    );
    this.rowsBig = media$.pipe(
      map(change => {
        return rowsMapBig.get(change[0].mqAlias);
      }),
      startWith(startRowsBig),
    );
  }

  createCards(): void {
    this.cartItems.forEach((v,index) => {
        this.contentfulService.getProductDetails(v.productId).forEach(
          x => {
            x.fields.variants = v.variants;
            x.fields.qty = v.qty;
            this.cartItemsService.addCard(
              new Card(
                {
                  name: {
                    key: Card.metadata.NAME,
                    value:  x.fields.title,
                  },
                  index: {
                    key: Card.metadata.INDEX,
                    value:  index,
                  },
                  object: {
                    key: Card.metadata.OBJECT,
                    value:  x,
                  },
                  cols: {
                    key: Card.metadata.COLS,
                    value: this['colsBig'],
                  },
                  rows: {
                    key: Card.metadata.ROWS,
                    value: this['rowsBig'],
                  }
                }, CartCardComponent, /* Reference to the component we'd like to spawn */
              ),
            );
          }
        )

      }
    );
  }

  public toggleSideNav() {
    if(this.navService.getActivePage().title == 'Product Details') {
      this.isOpen = !this.isOpen;
      let timerId = setTimeout(() => this.isOpen = false, 3000);
    }
  }

  public expandMainMenu() {
    if (this.mainMenuOpen) {
      this.mainMenuOpen = false;
    } else {
      this.mainMenuOpen = true;
    }
  }

  public hideMainMenu() {
    this.mainMenuOpen = false;
  }

  public getNavigationItems(): NavRoute[] {
    return this.navService.getNavigationItems();
  }

  public getActivePage(): Page {
    return this.navService.getActivePage();
  }

  public logout() {
    this.authService.doLogout();
    this.router.navigateByUrl('/');
    // this.router.navigate(['login'], {replaceUrl: true});
  }

  public goToCart() {
    this.router.navigateByUrl('cart');
  }

  public getPreviousUrl(): string[] {
    return this.navService.getPreviousUrl();
  }

  ngOnDestroy(): void {
    this.SettingsSubscription.unsubscribe();
    this.CartSubscription.unsubscribe();
  }
}
