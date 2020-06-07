import { Component, OnInit, Input } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Entry } from 'contentful';
import { Store, select } from '@ngrx/store';
import ProductsState from 'src/app/services/store/product/product.state';
import { Card } from '../../cards/card';
import { ProductCardComponent } from '../../cards/product-card/product-card.component';
import { ProductCardsService } from './product-cards.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'doo-more-from-cat-carousel',
  templateUrl: './more-from-cat-carousel.component.html',
  styleUrls: ['./more-from-cat-carousel.component.scss']
})
export class MoreFromCatCarouselComponent implements OnInit {

  @Input() widget;

  loadedProducts$: Observable<Entry<any>[]>;
  LoadedProductsSubscription: Subscription;
  loadedProducts: any[];
  relatedProductCards: Card[] = [];
  productVariants: Map<string,[any]> = new Map();

  constructor(store: Store<{ products: ProductsState }>,
              private cardsService: ProductCardsService) {
    this.cardsService.cards.subscribe(cards => {
      this.relatedProductCards = cards;
    });

    this.loadedProducts$ = store.pipe(select('products' , 'loadedProducts'));
  }

  ngOnInit() {
    //console.log('widget',this.widget);

    
    this.LoadedProductsSubscription = this.loadedProducts$
    .pipe(
      map(x => {
        if (x) {
          this.loadedProducts = x;
          this.createCardsForCarousel();
        } else {
          this.cardsService.resetCards();
        }
        
      })
    )
    .subscribe();
  }

  createCardsForCarousel(): void {
    this.loadedProducts.forEach((v , index) => {
      this.sortVariantsForCarousel(v);
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
      },
    );
  }

  sortVariantsForCarousel(product) {
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

  ngOnDestroy(){
    this.LoadedProductsSubscription.unsubscribe();
    this.cardsService.resetCards();
  }

}
