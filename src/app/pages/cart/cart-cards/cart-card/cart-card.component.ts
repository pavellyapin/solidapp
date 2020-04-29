import {Component, Injector, OnInit} from '@angular/core';
import { AbstractCardComponent } from 'src/app/components/cards/abstract-card-component';
import { Card } from 'src/app/components/cards/card';
import { Store, select } from '@ngrx/store';
import * as CartActions from '../../../../services/store/cart/cart.action';
import { FormGroup, FormControl } from '@angular/forms';
import * as UserActions from '../../../../services/store/user/user.action';
import { Observable, Subscription } from 'rxjs';
import { FavoriteItem } from 'src/app/services/store/user/user.model';
import UserState from 'src/app/services/store/user/user.state';
import { map } from 'rxjs/operators';

@Component({
  selector: 'doo-cart-card',
  templateUrl: './cart-card.component.html',
  styleUrls: ['./cart-card.component.scss']
})
export class CartCardComponent extends AbstractCardComponent implements OnInit {

  cartItemForm:FormGroup;
  user$:Observable<UserState>;
  UserSubscription: Subscription;
  isFavorite:FavoriteItem;
  loading:boolean = true;

  constructor(private injector: Injector , private store: Store<{user :UserState}>) {
    super(injector.get(Card.metadata.NAME),
      injector.get(Card.metadata.INDEX),
      injector.get(Card.metadata.OBJECT),
      injector.get(Card.metadata.COLS),
      injector.get(Card.metadata.ROWS));

      this.user$ = store.pipe(select('user'));
  }

  ngOnInit() {
    //console.log(this);
    this.UserSubscription = this.user$
    .pipe(
      map(x => {
        this.isFavorite = undefined;
        x.favorites.forEach(element => {
          if (this.object.sys.id == element.product.productId) {
            this.isFavorite = element;
            return
          }
        });
      })
    )
    .subscribe();
    
    this.cartItemForm = new FormGroup({        
      qty: new FormControl('')
    })
  }
  
  addToFavorites() {
    this.store.dispatch(UserActions.BeginAddToFavoritesAction({payload : this.object.sys.id}));
  }

  removeFromFavorites() {
    this.store.dispatch(UserActions.BeginRemoveFromFavoritesAction({payload : this.isFavorite.docId}));
  }


  removeFromCart(){
    this.store.dispatch(CartActions.BeginRemoveProductFromCartAction({payload : this.index}));
  }

}
