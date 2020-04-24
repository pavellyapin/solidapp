import {Component, Injector, OnInit} from '@angular/core';
import { AbstractCardComponent } from 'src/app/components/cards/abstract-card-component';
import { Card } from 'src/app/components/cards/card';
import { Store } from '@ngrx/store';
import * as CartActions from '../../../../services/store/cart/cart.action';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'doo-nav-cart-card',
  templateUrl: './cart-card.component.html',
  styleUrls: ['./cart-card.component.scss']
})
export class CartCardComponent extends AbstractCardComponent implements OnInit {

  cartItemForm:FormGroup;

  constructor(private injector: Injector , private store: Store<{}>) {
    super(injector.get(Card.metadata.NAME),
      injector.get(Card.metadata.INDEX),
      injector.get(Card.metadata.OBJECT),
      injector.get(Card.metadata.COLS),
      injector.get(Card.metadata.ROWS));
  }

  ngOnInit() {
    //console.log(this);
    this.cartItemForm = new FormGroup({        
      qty: new FormControl('')
    })
  }

  removeFromCart(){
    this.store.dispatch(CartActions.BeginRemoveProductFromCartAction({payload : this.index}));
  }

}
