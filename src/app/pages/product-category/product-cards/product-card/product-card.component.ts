import {Component, Injector, OnInit} from '@angular/core';
import { AbstractCardComponent } from 'src/app/components/cards/abstract-card-component';
import { Card } from 'src/app/components/cards/card';
import { NavigationService } from 'src/app/services/navigation/navigation.service';
import { Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import UserState from 'src/app/services/store/user/user.state';
import * as UserActions from '../../../../services/store/user/user.action';
import { Observable, Subscription } from 'rxjs';
import { FavoriteItem } from 'src/app/services/store/user/user.model';
import { map } from 'rxjs/operators';
import { UtilitiesService } from 'src/app/services/util/util.service';

@Component({
  selector: 'doo-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss']
})
export class ProductCardComponent extends AbstractCardComponent implements OnInit {

  imageIndex:number = 0;
  favorites$:Observable<FavoriteItem[]>;
  UserSubscription: Subscription;
  isFavorite:FavoriteItem;
  productVariants: Map<string,[any]> = new Map();

  constructor(private injector: Injector, 
              private navService: NavigationService,
              private router: Router,
              private store: Store<{ user:UserState }>,
              private utilService: UtilitiesService) {
    super(injector.get(Card.metadata.NAME),
      injector.get(Card.metadata.INDEX),
      injector.get(Card.metadata.OBJECT),
      injector.get(Card.metadata.ROUTERLINK),
      injector.get(Card.metadata.ICONCLASS),
      injector.get(Card.metadata.COLS),
      injector.get(Card.metadata.ROWS),
      injector.get(Card.metadata.COLOR));

      this.favorites$ = store.pipe(select('user','favorites'));
  }

  ngOnInit() {
    this.UserSubscription = this.favorites$
    .pipe(
      map(favorites => {
        this.isFavorite = undefined;
        if (favorites) {
          favorites.forEach(element => {
            if (this.object.sys.id == element.product.productId) {
              this.isFavorite = element;
              return
            }
          });
        }
      })
    )
    .subscribe();
    this.sortVariants();
  }

  sortVariants() {
    this.object.fields.variants.forEach(variant => {
      if(this.productVariants.get(variant.fields.option)) {
        this.productVariants.get(variant.fields.option).push({name:variant.fields.name,code:variant.fields.code});
      } else {
        this.productVariants.set(variant.fields.option , 
                               [{name:variant.fields.name,code:variant.fields.code,checked:true}]);
      }
    });
  }

  goToProduct() {
    this.navService.startLoading();
    this.navService.resetStack([]);
    this.utilService.scrollTop();
    this.router.navigateByUrl(this.routerLink);
  }

  toggleFavorites(isFavorite) {
    if (!isFavorite) {
      this.store.dispatch(UserActions.BeginAddToFavoritesAction({payload : this.object.sys.id}));
    } else {
      this.store.dispatch(UserActions.BeginRemoveFromFavoritesAction({payload : this.isFavorite.docId}));
    }
  }

  mouseEnter() {
    if (this.object.fields.media.length > 1) {
      this.imageIndex = 1;
    }
  }

  mouseLeave() {
    this.imageIndex = 0;
  }

  ngOnDestroy(){
    this.UserSubscription.unsubscribe();
  }

}
