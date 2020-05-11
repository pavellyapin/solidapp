import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store, select } from '@ngrx/store';
import ProductsState from 'src/app/services/store/product/product.state';
import { Observable, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Card } from 'src/app/components/cards/card';
import { MediaObserver } from '@angular/flex-layout';
import { ProductCardsService } from './product-cards/product-cards.service';
import { ProductCardComponent } from './product-cards/product-card/product-card.component';
import { Entry } from 'contentful';

@Component({
    selector: 'app-product-category-page',
    templateUrl: './product-category.component.html',
    styleUrls: ['./product-category.component.scss'],
  })
  export class ProductCategoryComponent implements OnInit , OnDestroy{

    product$: Observable<Entry<any>[]>;
    ProductSubscription: Subscription;
    productsLoaded:Entry<any>[];
    productCards: Card[] = [];
    previousUrl:string = '';
    cols: Observable<number>;
    colsBig: Observable<number>;
    rowsBig: Observable<number>;
    
    constructor(store: Store<{ products: ProductsState }>,
                private mediaObserver: MediaObserver,
                private cardsService: ProductCardsService)
    {
      this.cardsService.cards.subscribe(cards => {
        this.productCards = cards;
      });
      this.product$ = store.pipe(select('products' , 'loadedProducts'));

    }
 
    ngOnInit() {
      this.ProductSubscription = this.product$
      .pipe(
        map(x => {
          this.productsLoaded = x;
          this.cardsService.resetCards();
          if (this.productsLoaded) {
            this.createCards();
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
        ['xs', 12],
        ['sm', 2],
        ['md', 4],
        ['lg', 5],
        ['xl', 3],
      ]);
      /* Small card column span map */
      const rowsMapBig = new Map([
        ['xs', 21],
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

    createCards(): void {
      this.productsLoaded.forEach((v , index) => {
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
              }, ProductCardComponent, /* Reference to the component we'd like to spawn */
            ),
          );
        },
      );
    }


    ngOnDestroy(): void {
      this.ProductSubscription.unsubscribe();
      this.cardsService.resetCards();
    }


  }