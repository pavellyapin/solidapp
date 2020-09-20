import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { ActivatedRoute } from '@angular/router';
import * as CartActions from 'src/app/services/store/cart/cart.action';

@Component({
  selector: 'doo-cart-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss'],
})
export class CartErrorComponent {


  constructor(private store: Store<{}>,
              public route: ActivatedRoute) {
  }

  ngOnInit() {
    
  }

  refreshCart() {
    this.store.dispatch(CartActions.BeginSetCartStatusAction({ payload: {cartId :this.route.snapshot.params["cartId"] , status : "retry" } }));
  }

  ngOnDestroy(): void {
  }

}
