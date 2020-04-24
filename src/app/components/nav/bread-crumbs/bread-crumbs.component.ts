import {Component, Input, OnInit} from '@angular/core';
import { Store, select } from '@ngrx/store';
import ProductsState from 'src/app/services/store/product/product.state';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'doo-bread-crumbs',
  templateUrl: './bread-crumbs.component.html',
  styleUrls: ['./bread-crumbs.component.scss'],
})
export class BreadCrumbsComponent implements OnInit {

  @Input() productTitle: string;
  product$: Observable<ProductsState>;
  ProductSubscription: Subscription;
  breadCrumbs = [];

  constructor(store: Store<{ products: ProductsState }>) {
    this.product$ = store.pipe(select('products'));
  }

  ngOnInit() {
    this.ProductSubscription = this.product$
    .pipe(
      map(x => {
        if (x.activeCategory) {
          this.buildBreadCrumbs(x.activeCategory);
        }
      })
    )
    .subscribe();

  }

  buildBreadCrumbs(activeCategory) {
    this.breadCrumbs = [];
    let parentExists = true;
    let category = activeCategory;

    while (parentExists) {
      let title = category.fields.title;
      let router = category.fields.redirect ? category.fields.redirect.fields.name : category.fields.name;
      this.breadCrumbs.unshift({title:title,link:'/cat/' + router})
      if(!category.fields.parent || category.fields.parent.root) {
         parentExists = false;
      } else {
        category = category.fields.parent;
      }
    }
  }
}
