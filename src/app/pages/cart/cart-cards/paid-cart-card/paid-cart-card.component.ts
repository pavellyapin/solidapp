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
  selector: 'doo-paid-cart-card',
  templateUrl: './paid-cart-card.component.html',
  styleUrls: ['./paid-cart-card.component.scss']
})
export class PaidCartCardComponent extends AbstractCardComponent implements OnInit {

  constructor(private injector: Injector , private store: Store<{user :UserState}>) {
    super(injector.get(Card.metadata.NAME),
      injector.get(Card.metadata.INDEX),
      injector.get(Card.metadata.OBJECT),
      injector.get(Card.metadata.COLS),
      injector.get(Card.metadata.ROWS));
  }

  ngOnInit() {
    
  }
}
