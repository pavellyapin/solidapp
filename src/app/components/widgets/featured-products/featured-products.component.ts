import { Component, OnInit, Input } from '@angular/core';
import { Observable, Subscription, BehaviorSubject } from 'rxjs';
import { Entry } from 'contentful';
import { Store, select } from '@ngrx/store';
import ProductsState from 'src/app/services/store/product/product.state';
import { Card } from '../../cards/card';
import { ProductCardComponent } from '../../cards/product-card/product-card.component';
import { map } from 'rxjs/operators';

@Component({
  selector: 'doo-featured-products',
  templateUrl: './featured-products.component.html',
  styleUrls: ['./featured-products.component.scss']
})
export class FeaturedProductsComponent implements OnInit {

  @Input() widget: Entry<any>;

  loadedProducts$: Observable<Entry<any>[]>;
  loadedProducts: any[];
  relatedProductCards: Card[] = [];
  productVariants: Map<string, [any]> = new Map();
  cards: BehaviorSubject<Card[]> = new BehaviorSubject<Card[]>([]);

  constructor(store: Store<{ products: ProductsState }>) {
    this.cards.subscribe(cards => {
      this.relatedProductCards = cards;
    });

    this.loadedProducts$ = store.pipe(select('products', 'loadedProducts'));
  }

  ngOnInit() {
    //console.log('widget',this.widget);

    this.loadedProducts = this.widget.fields.blocks;
    this.createCardsForCarousel();
  }

  createCardsForCarousel(): void {
    this.loadedProducts.forEach((v, index) => {
      if (v.fields) {
        if (v.fields.variants) {
          this.sortVariantsForCarousel(v);
        }
        
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
              style: {
                key: Card.metadata.STYLE,
                value: 'simple',
              },
            }, ProductCardComponent,
          ),
        );
      }
    },
    );
  }

  sortVariantsForCarousel(product) {
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

  addCard(card: Card): void {
    this.cards.next(this.cards.getValue().concat(card));
  }

  resetCards(): void {
    this.cards.getValue().splice(0, this.cards.getValue().length);
  }

  ngOnDestroy() {
    this.resetCards();
  }

}
