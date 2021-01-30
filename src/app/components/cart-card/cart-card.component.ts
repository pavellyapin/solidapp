import { Component, Injector, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import * as CartActions from 'src/app/services/store/cart/cart.action';
import * as UserActions from 'src/app/services/store/user/user.action';
import { Observable, Subscription } from 'rxjs';
import { FavoriteItem } from 'src/app/services/store/user/user.model';
import UserState from 'src/app/services/store/user/user.state';
import { map } from 'rxjs/operators';
import { AbstractCartCardComponent } from './abstract-cart-card-component';
import { NavigationService } from 'src/app/services/navigation/navigation.service';
import { Router } from '@angular/router';
import { UtilitiesService } from 'src/app/services/util/util.service';
import { CartCard } from './cart-card';

@Component({
  selector: 'doo-cart-card',
  templateUrl: './cart-card.component.html',
  styleUrls: ['./cart-card.component.scss']
})
export class CartCardComponent extends AbstractCartCardComponent implements OnInit {

  layout: string = 'fashion';
  favorites$: Observable<FavoriteItem[]>;
  UserSubscription: Subscription;
  isFavorite: FavoriteItem;
  loading: boolean = true;

  constructor(private injector: Injector,
    private store: Store<{ user: UserState }>,
    private navService: NavigationService,
    private router: Router,
    private utilService: UtilitiesService) {
    super(injector.get(CartCard.metadata.NAME),
      injector.get(CartCard.metadata.INDEX),
      injector.get(CartCard.metadata.OBJECT),
      injector.get(CartCard.metadata.COLS),
      injector.get(CartCard.metadata.ROWS));

    this.favorites$ = store.pipe(select('user', 'favorites'));
  }

  ngOnInit() {
    this.UserSubscription = this.favorites$
      .pipe(
        map(x => {
          if (x) {
            x.forEach(element => {
              if (this.object.sys && this.object.sys.id == element.product.productId) {
                this.isFavorite = element;
                return
              }
            });
          }

        })
      )
      .subscribe();
  }

  goToProduct() {
    this.navService.resetStack([]);
    this.utilService.scrollTop();
    this.router.navigateByUrl('product/' + this.object.product.sys.id);
  }

  favoriteToggle(isFavorite) {
    if (isFavorite) {
      this.store.dispatch(UserActions.BeginAddToFavoritesAction({ payload: this.object.sys.id }));
    } else {
      this.store.dispatch(UserActions.BeginRemoveFromFavoritesAction({ payload: this.isFavorite.docId }));
    }
  }

  removeFromCart() {
    this.store.dispatch(CartActions.BeginRemoveProductFromCartAction({ payload: this.index }));
  }

}
