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
import { ActivatedRoute } from '@angular/router';
import { UtilitiesService } from 'src/app/services/util/util.service';
import { SEOService } from 'src/app/services/seo/seo.service';

@Component({
  selector: 'app-search-page',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit, OnDestroy {

  product$: Observable<Entry<any>[]>;
  settings$: Observable<SettingsState>;
  ProductSubscription: Subscription;
  SettingsSubscription: Subscription;
  searchPageContent: Entry<any>;
  productsLoaded: Entry<any>[];
  productsDisplayed: Entry<any>[];
  relatedCategories: Entry<any>[];
  productCards: Card[] = [];
  previousUrl: string = '';
  cols: Observable<number>;
  colsBig: Observable<number>;
  rowsBig: Observable<number>;
  resolution: any;
  navMode: any;
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
    private navService: NavigationService,
    public route: ActivatedRoute,
    public utilService: UtilitiesService,
    private seoService : SEOService) {
    window.addEventListener('scroll', this.loadMore.bind(this), { passive: true });
    this.cards.subscribe(cards => {
      this.productCards = cards;
    });
    this.product$ = store.pipe(select('products', 'searchResults'));
    this.settings$ = store.pipe(select('settings'));

  }

  ngOnInit() {
    this.ProductSubscription = this.product$
      .pipe(
        map(x => {
          this.productsLoaded = x;
          this.resetCards();
          if (this.productsLoaded) {
            this.createCards();
          }
        })
      )
      .subscribe();
    this.ProductSubscription = this.product$
      .pipe(
        map(x => {
          this.resetCards();
          this.productVariants = new Map();
          this.productsLoaded = [];
          this.productsDisplayed = [];
          if (x && x.length > 0) {
            this.productsLoaded = x;
            this.productsDisplayed = this.utilService.
              shuffleArray(this.productsLoaded.map(products => { return products }));
            this.createCards();
          } else {
            this.navService.finishLoading();
          }
        })
      )
      .subscribe();

    this.SettingsSubscription = this.settings$
      .pipe(
        map(x => {
          this.resolution = x.resolution;
          if (this.utilService.bigScreens.includes(this.resolution)) {
            this.navMode = 'side';
            this.filtersOpen = true;
          } else {
            this.navMode = 'over';
            this.filtersOpen = false;
          }
          this.relatedCategories = x.categories.filter(category => {
            if (category.fields.title.toLowerCase().includes(this.route.snapshot.params['key'].toLowerCase())) {
              return category;
            }
          })

          this.searchPageContent = x.pages.filter(page => {
            if (page.fields.type == 'search') {
              this.seoService.updateTitle(page.fields.title);
              this.seoService.updateDescription(page.fields.description);
              this.seoService.updateOgUrl(window.location.href);
              return page;
            }
          }).pop();
        })
      )
      .subscribe();
    /* Grid column map */
    const colsMap = new Map([
      ['xs', 24],
      ['sm', 24],
      ['md', 18],
      ['lg', 9],
      ['xl', 9],
    ]);
    /* Big card column span map */
    const colsMapBig = new Map([
      ['xs', 12],
      ['sm', 8],
      ['md', 6],
      ['lg', 3],
      ['xl', 3],
    ]);
    /* Small card column span map */
    const rowsMapBig = new Map([
      ['xs', 17],
      ['sm', 10],
      ['md', 7],
      ['lg', 3],
      ['xl', 3],
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

  ngAfterViewInit() {
    this.navService.finishLoading();
  }

  goToCategory(category) {
    this.navService.ctaClick(category);
  }

  createCards(): void {
    if (this.productsDisplayed) {
      this.productsDisplayed.slice(this.cards.value.length, this.cards.value.length + this.productsLoadedInt).forEach((v, index) => {
        this.sortVariants(v);
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

    this.navService.finishLoading();
  }

  loadMore() {
    if (this.productsLoaded.length > 0 && window.scrollY > this.productsGrid.nativeElement.offsetHeight - (this.utilService.bigScreens.includes(this.resolution) ? 500 : 800)) {
      this.createCards();
    }
  }

  addCard(card: Card): void {
    this.cards.next(this.cards.getValue().concat(card));
  }

  resetCards(): void {
    this.cards.getValue().splice(0, this.cards.getValue().length);
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
    if (product.fields.variants) {
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
    if (s1.input.object.value.fields.price > s2.input.object.value.fields.price) return 1
    else if (s1.input.object.value.fields.price === s2.input.object.value.fields.price) return 0
    else return -1
  }

  priceHighLow(s1: Card, s2: Card) {
    if (s1.input.object.value.fields.price > s2.input.object.value.fields.price) return -1
    else if (s1.input.object.value.fields.price === s2.input.object.value.fields.price) return 0
    else return 1
  }


  ngOnDestroy(): void {
    window.removeEventListener('scroll', this.loadMore.bind(this));
    this.ProductSubscription.unsubscribe();
    this.SettingsSubscription.unsubscribe();
    this.resetCards();
  }


}