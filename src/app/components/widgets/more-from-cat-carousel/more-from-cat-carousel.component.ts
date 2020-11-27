import { Component, OnInit, Input } from '@angular/core';
import { Observable, Subscription, BehaviorSubject } from 'rxjs';
import { Entry } from 'contentful';
import { Store, select } from '@ngrx/store';
import ProductsState from 'src/app/services/store/product/product.state';
import { Card } from '../../cards/card';
import { ProductCardComponent } from '../../cards/product-card/product-card.component';
import { map } from 'rxjs/operators';

@Component({
  selector: 'doo-more-from-cat-carousel',
  templateUrl: './more-from-cat-carousel.component.html',
  styleUrls: ['./more-from-cat-carousel.component.scss']
})
export class MoreFromCatCarouselComponent implements OnInit {

  @Input() widget :Entry<any>;

  loadedProducts$: Observable<Entry<any>[]>;
  LoadedProductsSubscription: Subscription;
  loadedProducts: any[];
  relatedProductCards: Card[] = [];
  productVariants: Map<string,[any]> = new Map();
  cards: BehaviorSubject<Card[]> = new BehaviorSubject<Card[]>([]);

  constructor(store: Store<{ products: ProductsState }>) {
    this.cards.subscribe(cards => {
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
          if (this.loadedProducts && this.loadedProducts.length) {
            this.createCardsForCarousel();
          }
        } else {
          this.resetCards();
        }
        
      })
    )
    .subscribe();
  }

  createCardsForCarousel(): void {
    this.loadedProducts.forEach((v , index) => {
      this.sortVariantsForCarousel(v);
        this.addCard(
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
              style: {
                key: Card.metadata.STYLE,
                value: 'blue',
              },
            }, ProductCardComponent,
          ),
        );
      },
    );
  }

  sortVariantsForCarousel(product) {
    if(product.fields.variants) {
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
  }

  addCard(card: Card): void {
    this.cards.next(this.cards.getValue().concat(card));
  }

  resetCards(): void {
    this.cards.getValue().splice(0,this.cards.getValue().length);
  }

  ngOnDestroy(){
    this.LoadedProductsSubscription.unsubscribe();
    this.resetCards();
  }

}
