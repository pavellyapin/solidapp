import { Component, OnInit, OnDestroy, ViewChildren, QueryList, ViewChild, ElementRef } from '@angular/core';
import { Store, select } from '@ngrx/store';
import ProductsState from 'src/app/services/store/product/product.state';
import { Observable, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Card } from 'src/app/components/cards/card';
import { MediaObserver } from '@angular/flex-layout';
import { ProductCardsService } from './product-cards/product-cards.service';
import { ProductCardComponent } from './product-cards/product-card/product-card.component';
import { Entry } from 'contentful';
import SettingsState from 'src/app/services/store/settings/settings.state';
import { NavigationService } from 'src/app/services/navigation/navigation.service';

@Component({
    selector: 'app-product-category-page',
    templateUrl: './product-category.component.html',
    styleUrls: ['./product-category.component.scss'],
  })
  export class ProductCategoryComponent implements OnInit , OnDestroy{

    product$: Observable<ProductsState>;
    settings$: Observable<SettingsState>;
    ProductSubscription: Subscription;
    SettingsSubscription: Subscription;
    productsLoaded:Entry<any>[];
    activeCategory:Entry<any>;
    productCards: Card[] = [];
    previousUrl:string = '';
    cols: Observable<number>;
    colsBig: Observable<number>;
    rowsBig: Observable<number>;
    resolution : any;
    navMode : any;
    bigScreens = new Array('lg' , 'xl')
    productVariants: Map<string,[any]> = new Map();
    filters = new Array<any>();
    filtersOpen : boolean;
    colorPanelOpenState : boolean = true;
    sizePanelOpenState: boolean = true;

    @ViewChildren("checkboxVariants") checkboxVariants!: QueryList<any>
    @ViewChild('sortSelect',{static: false}) sortSelect: ElementRef;
    
    constructor(store: Store<{ products: ProductsState , settings : SettingsState }>,
                private mediaObserver: MediaObserver,
                private cardsService: ProductCardsService,
                private navService : NavigationService)
    {
      this.cardsService.cards.subscribe(cards => {
        this.productCards = cards;
      });
      this.product$ = store.pipe(select('products'));
      this.settings$ = store.pipe(select('settings'));

    }
 
    ngOnInit() {
      this.ProductSubscription = this.product$
      .pipe(
        map(x => {
          this.productsLoaded = x.loadedProducts;
          this.activeCategory = x.activeCategory;
          this.cardsService.resetCards();
          if (this.productsLoaded) {
            this.createCards();
          }
        })
      )
      .subscribe();

      this.SettingsSubscription = this.settings$
      .pipe(
        map(x => {
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

      /* Grid column map */
      const colsMap = new Map([
        ['xs', 12],
        ['sm', 4],
        ['md', 8],
        ['lg', 15],
        ['xl', 18],
      ]);
      /* Big card column span map */
      const colsMapBig = new Map([
        ['xs', 6],
        ['sm', 2],
        ['md', 4],
        ['lg', 5],
        ['xl', 3],
      ]);
      /* Small card column span map */
      const rowsMapBig = new Map([
        ['xs', 11],
        ['sm', 3],
        ['md', 5],
        ['lg', 8],
        ['xl', 2],
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

    createCards(): void {
      this.productsLoaded.forEach((v , index) => {
        this.sortVariants(v);
        if (this.filters.length == 0 || this.filterProduct(v)) {
          this.cardsService.addCard(
            new Card(
              {
                name: {
                  key: Card.metadata.NAME,
                  value:  v.fields.title,
                },
                index: {
                  key: Card.metadata.INDEX,
                  value:  index,
                },
                object: {
                  key: Card.metadata.OBJECT,
                  value:  v,
                },
                routerLink: {
                  key: Card.metadata.ROUTERLINK,
                  value: '/product/' + v.sys.id,
                },
                iconClass: {
                  key: Card.metadata.ICONCLASS,
                  value: 'fa-users',
                },
                cols: {
                  key: Card.metadata.COLS,
                  value: this['colsBig'],
                },
                rows: {
                  key: Card.metadata.ROWS,
                  value: this['rowsBig'],
                },
                color: {
                  key: Card.metadata.COLOR,
                  value: 'blue',
                },
              }, ProductCardComponent,
            ),
          );
        }
        },
      );
      this.navService.finishLoading();
    }

    filterProduct(v) : boolean {
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
        let variantObject = {name:variant.fields.name,code:variant.fields.code};
        if(this.productVariants.get(variant.fields.option)) {
          if (!this.productVariants.get(variant.fields.option).
              some(item => item.name == variantObject.name && item.code == variantObject.code)) {
            this.productVariants.get(variant.fields.option).push(variantObject);
          }
        } else {
          this.productVariants.set(variant.fields.option , 
                                 [variantObject]);
        }
      });
    }

    filterToggle(checkbox , type) {
      if (checkbox.checked) {
        this.filters.push({name : checkbox.source.value , type : type })
      } else {
        this.filters = this.filters.filter(filter => {
          if (!(filter.name == checkbox.source.value && filter.type == type)) {
            return filter;
          }
        });
      }
      
      this.cardsService.resetCards();
      this.createCards();
    }

    removeFilterChip(chip) {
      this.filters = this.filters.filter(filter => {
        if (!(filter.name == chip.name && filter.type == chip.type)) {
          return filter;
        }
      });

      this.checkboxVariants.forEach(filter=> {
        if (filter.id == (chip.name + '-' + chip.type)) {
          filter['checked'] = false;
        }
      })
       
      this.cardsService.resetCards();
      this.createCards();
    }

    sortBy(sortBy) {
      let sortedCards = this.productCards.map(card=> {
        return card;
      });

      if (sortBy.value == 'price-low-high') {
        sortedCards.sort(this.priceLowHigh);
      } else if (sortBy.value == 'price-high-low') {
        sortedCards.sort(this.priceHighLow);
      }
      this.sortSelect['value'] = '';
      this.cardsService.resetCards();
      sortedCards.forEach(card => {
        this.cardsService.addCard(card);
      })
    }

    priceLowHigh (s1:Card , s2:Card) {
      if(s1.input.object.value.fields.price > s2.input.object.value.fields.price) return 1
      else if (s1.input.object.value.fields.price === s2.input.object.value.fields.price) return 0
      else return -1
    }

    priceHighLow (s1:Card , s2:Card) {
      if(s1.input.object.value.fields.price > s2.input.object.value.fields.price) return -1
      else if (s1.input.object.value.fields.price === s2.input.object.value.fields.price) return 0
      else return 1
    }
  

    ngOnDestroy(): void {
      this.ProductSubscription.unsubscribe();
      this.SettingsSubscription.unsubscribe();
      this.cardsService.resetCards();
    }


  }