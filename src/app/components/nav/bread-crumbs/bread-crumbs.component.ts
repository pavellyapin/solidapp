import {Component, Input, OnInit} from '@angular/core';
import { Store, select } from '@ngrx/store';
import ProductsState from 'src/app/services/store/product/product.state';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { Entry } from 'contentful';
import { NavigationService } from 'src/app/services/navigation/navigation.service';
import { Router } from '@angular/router';

@Component({
  selector: 'doo-bread-crumbs',
  templateUrl: './bread-crumbs.component.html',
  styleUrls: ['./bread-crumbs.component.scss'],
})
export class BreadCrumbsComponent implements OnInit {

  @Input() productTitle: string;
  activeCategory$: Observable<Entry<any>>;
  ProductSubscription: Subscription;
  breadCrumbs = [];

  constructor(store: Store<{ products: ProductsState }>,public navService: NavigationService,private router: Router) {
    this.activeCategory$ = store.pipe(select('products' , 'activeCategory'));
  }

  ngOnInit() {
    this.ProductSubscription = this.activeCategory$
    .pipe(
      map(x => {
        if (x) {
          this.buildBreadCrumbs(x);
        }
      })
    )
    .subscribe();

  }

  navigate(link) {
    if (link.object.fields.redirect) {
      this.navService.ctaClick(link.object.fields.redirect);
      return;
    } else {
      this.router.navigateByUrl(link.link)
    }
  }

  buildBreadCrumbs(activeCategory) {
    this.breadCrumbs = [];
    let parentExists = true;
    let category = activeCategory;

    while (parentExists) {
      let title = category.fields.title;
      let router = category.fields.redirect ? category.fields.redirect.fields.name : category.fields.name;
      this.breadCrumbs.unshift({title:title,link:'/cat/' + router , object : category})
      if(!category.fields.parent || category.fields.parent.root) {
         parentExists = false;
      } else {
        category = category.fields.parent;
      }
    }
  }
}
