import { Component, OnInit, OnDestroy, ViewChildren, QueryList, ViewChild, ElementRef } from '@angular/core';
import { Store, select } from '@ngrx/store';
import ProductsState from 'src/app/services/store/product/product.state';
import { Observable, Subscription, BehaviorSubject } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Card } from 'src/app/components/cards/card';
import { MediaObserver } from '@angular/flex-layout';
import { Entry } from 'contentful';
import SettingsState from 'src/app/services/store/settings/settings.state';
import { NavigationService } from 'src/app/services/navigation/navigation.service';
import { ProductCardComponent } from 'src/app/components/cards/product-card/product-card.component';
import { UtilitiesService } from 'src/app/services/util/util.service';
import { SEOService } from 'src/app/services/seo/seo.service';
import { Actions, ofType } from '@ngrx/effects';
import * as ProductActions from 'src/app/services/store/product/product.action';
import { RouterStateSnapshot, Route, Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product-category-page',
  templateUrl: './product-category.component.html',
  styleUrls: ['./product-category.component.scss'],
})
export class ProductCategoryComponent implements OnInit, OnDestroy {

  product$: Observable<ProductsState>;
  settings$: Observable<SettingsState>;
  ProductSubscription: Subscription;
  ProductsLoadedSubscription: Subscription;
  SettingsSubscription: Subscription;
  productsLoaded: Entry<any>[];
  productsDisplayed: Entry<any>[];
  relatedCategories: Entry<any>[];
  activeCategory: Entry<any>;
  productCards: Card[] = [];
  previousUrl: string = '';
  cols: Observable<number>;
  colsBig: Observable<number>;
  rowsBig: Observable<number>;
  resolution: any;
  navMode: any;
  isSearch: boolean = false;
  showFilters: boolean = true;
  bigScreens = new Array('lg', 'xl', 'md')
  productVariants: Map<string, [any]> = new Map();
  filters = new Array<any>();
  filtersOpen: boolean;
  colorPanelOpenState: boolean = true;
  sizePanelOpenState: boolean = true;
  productsLoadedInt: number = 9;
  cards: BehaviorSubject<Card[]> = new BehaviorSubject<Card[]>([]);

  @ViewChildren("checkboxVariants") checkboxVariants!: QueryList<any>
  @ViewChild('sortSelect', { static: false }) sortSelect: ElementRef;
  @ViewChild('productsGrid', { static: false }) productsGrid: ElementRef;

  constructor(store: Store<{ products: ProductsState, settings: SettingsState }>,
    private mediaObserver: MediaObserver,
    private _actions$: Actions,
    public navService: NavigationService,
    private utilService: UtilitiesService,
    private seoService: SEOService,
    router: Router,
    public route: ActivatedRoute) {
    this.isSearch = router.url.startsWith('/search/');
    window.addEventListener('scroll', this.loadMore.bind(this), { passive: true });
    this.cards.subscribe(cards => {
      this.productCards = cards;
    });
    this.product$ = store.pipe(select('products'));
    this.settings$ = store.pipe(select('settings'));

  }

  ngOnInit() {
    this.ProductSubscription = this.product$
      .pipe(
        map(x => {
          this.seoService.updateOgUrl(window.location.href);
          this.resetCards();
          this.productVariants = new Map();
          this.productsLoaded = [];
          this.productsDisplayed = [];

          if (!this.isSearch) {
            this.activeCategory = x.activeCategory;
            this.seoService.updateTitle(this.activeCategory.fields.title);
            this.seoService.updateDescription(this.activeCategory.fields.description);

            if (x.loadedProducts && x.loadedProducts.length > 0) {
              this.productsLoaded = x.loadedProducts;
              this.productsDisplayed = this.utilService.
                shuffleArray(this.productsLoaded.map(products => { return products }));
              this.createCards();
            }
          } else {
            if (x.searchResults && x.searchResults.length > 0) {
              this.productsLoaded = x.searchResults;
              this.productsDisplayed = this.utilService.
                shuffleArray(this.productsLoaded.map(products => { return products }));
              this.createCards();
            } 
          }



        })
      )
      .subscribe();

    this.SettingsSubscription = this.settings$
      .pipe(
        map(x => {
          if (this.isSearch) {
            x.pages.forEach(page => {
              if (page.fields.type == 'search') {
                this.seoService.updateTitle(page.fields.title);
                this.seoService.updateDescription(page.fields.description);
                this.seoService.updateOgUrl(window.location.href);
              }
            });

            this.relatedCategories = x.categories.filter(category => {
              if (category.fields.title.toLowerCase().includes(this.route.snapshot.params['category'].toLowerCase())) {
                return category;
              }
            })
          }
          
          this.resolution = x.resolution;
          if (this.bigScreens.includes(this.resolution)) {
            this.navMode = 'side';
            this.filtersOpen = true;
          } else {
            this.navMode = 'over';
            this.filtersOpen = false;
          }
        })
      )
      .subscribe();

    this.ProductsLoadedSubscription = this._actions$.pipe(ofType(
      ProductActions.SuccessLoadProductsAction , ProductActions.SuccessSearchProductsAction
    )).subscribe(() => {
      this.navService.finishLoading();
    });

    let startCols: number;
    let startColsBig: number;
    let startRowsBig: number;
    Card.colsMap.forEach((cols, mqAlias) => {
      if (this.mediaObserver.isActive(mqAlias)) {
        startCols = cols;
      }
    });
    Card.colsMapBig.forEach((cols, mqAlias) => {
      if (this.mediaObserver.isActive(mqAlias)) {
        startColsBig = cols;
      }
    });
    Card.rowsMapBig.forEach((rows, mqAliast) => {
      if (this.mediaObserver.isActive(mqAliast)) {
        startRowsBig = rows;
      }
    });
    const media$ = this.mediaObserver.asObservable();
    this.cols = media$.pipe(
      map(change => {
        return Card.colsMap.get(change[0].mqAlias);
      }),
      startWith(startCols),
    );
    this.colsBig = media$.pipe(
      map(change => {
        return Card.colsMapBig.get(change[0].mqAlias);
      }),
      startWith(startColsBig),
    );
    this.rowsBig = media$.pipe(
      map(change => {
        return Card.rowsMapBig.get(change[0].mqAlias);
      }),
      startWith(startRowsBig),
    );

  }

  loadMore() {
    if (this.productsLoaded.length > 0 && window.scrollY > this.productsGrid.nativeElement.offsetHeight - (this.bigScreens.includes(this.resolution) ? 500 : 800)) {
      this.createCards();
    }
  }

  addCard(card: Card): void {
    this.cards.next(this.cards.getValue().concat(card));
  }

  resetCards(): void {
    this.cards.getValue().splice(0, this.cards.getValue().length);
  }

  createCards(): void {
    if (this.productsDisplayed) {
      this.productsDisplayed.slice(this.cards.value.length, this.cards.value.length + this.productsLoadedInt).forEach((v, index) => {
        if (v.fields.variants) {
          this.sortVariants(v);
        }
        if (this.filters.length == 0 || this.filterProduct(v)) {
          this.addCard(
            new Card(
              {
                name: {
                  key: Card.metadata.NAME,
                  value: v.fields.title,
                },
                index: {
                  key: Card.metadata.INDEX,
                  value: index,
                },
                object: {
                  key: Card.metadata.OBJECT,
                  value: v,
                },
                cols: {
                  key: Card.metadata.COLS,
                  value: this['colsBig'],
                },
                rows: {
                  key: Card.metadata.ROWS,
                  value: this['rowsBig'],
                },
                style: {
                  key: Card.metadata.STYLE,
                  value: 'full',
                },
              }, ProductCardComponent,
            ),
          );
        }
      },
      );
    }
  }

  filterProduct(v): boolean {
    let include = false;
    this.filters.forEach(filter => {
      v.fields.variants.forEach(element => {
        if (element.fields.option == filter.type && element.fields.name == filter.name) {
          include = true;
        }
      });
    });
    return include;
  }

  sortVariants(product) {
    product.fields.variants.forEach(variant => {
      let variantObject = { name: variant.fields.name, code: variant.fields.code };
      if (this.productVariants.get(variant.fields.option)) {
        if (!this.productVariants.get(variant.fields.option).
          some(item => item.name == variantObject.name && item.code == variantObject.code)) {
          this.productVariants.get(variant.fields.option).push(variantObject);
        }
      } else {
        this.productVariants.set(variant.fields.option,
          [variantObject]);
      }
    });
  }

  filterToggle(checkbox, type) {
    if (checkbox.checked) {
      this.filters.push({ name: checkbox.source.value, type: type })
    } else {
      this.filters = this.filters.filter(filter => {
        if (!(filter.name == checkbox.source.value && filter.type == type)) {
          return filter;
        }
      });
    }

    if (this.filters.length != 0) {
      this.productsDisplayed = this.productsLoaded.filter((product) => { if (this.filterProduct(product)) { return product } });
    } else {
      this.productsDisplayed = this.utilService.
        shuffleArray(this.productsLoaded.map(products => { return products }));
    }


    this.resetCards();
    this.createCards();
  }

  removeFilterChip(chip) {
    this.filters = this.filters.filter(filter => {
      if (!(filter.name == chip.name && filter.type == chip.type)) {
        return filter;
      }
    });

    this.checkboxVariants.forEach(filter => {
      if (filter.id == (chip.name + '-' + chip.type)) {
        filter['checked'] = false;
      }
    })

    if (this.filters.length != 0) {
      this.productsDisplayed = this.productsLoaded.filter((product) => { if (this.filterProduct(product)) { return product } });
    } else {
      this.productsDisplayed = this.utilService.
        shuffleArray(this.productsLoaded.map(products => { return products }));
    }
    this.resetCards();
    this.createCards();
  }

  sortBy(sortBy) {
    let sortedCards = this.productCards.map(card => {
      return card;
    });

    if (sortBy.value == 'price-low-high') {
      sortedCards.sort(this.priceLowHigh);
    } else if (sortBy.value == 'price-high-low') {
      sortedCards.sort(this.priceHighLow);
    }
    this.sortSelect['value'] = '';
    this.resetCards();
    sortedCards.forEach(card => {
      this.addCard(card);
    })
  }

  priceLowHigh(s1: Card, s2: Card) {
    let s1Price;
    let s2Price;
    if (s1.input.object.value.fields.variants[0] && s1.input.object.value.fields.variants[0].fields.price) {
      s1Price = s1.input.object.value.fields.variants[0].fields.price;
    } else {
      s1Price = s1.input.object.value.fields.discountPrice ? s1.input.object.value.fields.discountPrice : s1.input.object.value.fields.price;
    }

    if (s2.input.object.value.fields.variants[0] && s2.input.object.value.fields.variants[0].fields.price) {
      s2Price = s2.input.object.value.fields.variants[0].fields.price;
    } else {
      s2Price = s2.input.object.value.fields.discountPrice ? s2.input.object.value.fields.discountPrice : s2.input.object.value.fields.price;
    }
    if (s1Price > s2Price) return 1
    else if (s1Price === s2Price) return 0
    else return -1
  }

  priceHighLow(s1: Card, s2: Card) {
    let s1Price;
    let s2Price;
    if (s1.input.object.value.fields.variants[0] && s1.input.object.value.fields.variants[0].fields.price) {
      s1Price = s1.input.object.value.fields.variants[0].fields.price;
    } else {
      s1Price = s1.input.object.value.fields.discountPrice ? s1.input.object.value.fields.discountPrice : s1.input.object.value.fields.price;
    }

    if (s2.input.object.value.fields.variants[0] && s2.input.object.value.fields.variants[0].fields.price) {
      s2Price = s2.input.object.value.fields.variants[0].fields.price;
    } else {
      s2Price = s2.input.object.value.fields.discountPrice ? s2.input.object.value.fields.discountPrice : s2.input.object.value.fields.price;
    }
    if (s1Price > s2Price) return -1
    else if (s1Price === s2Price) return 0
    else return 1
  }



  ngOnDestroy(): void {
    window.removeEventListener('scroll', this.loadMore.bind(this));
    this.ProductSubscription.unsubscribe();
    this.SettingsSubscription.unsubscribe();
    this.ProductsLoadedSubscription.unsubscribe();
    this.resetCards();
  }


}