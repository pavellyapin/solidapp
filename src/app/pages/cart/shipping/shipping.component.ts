import { Component } from '@angular/core';
import { Store, select } from '@ngrx/store';
import CartState from 'src/app/services/store/cart/cart.state';
import { Observable, Subscription } from 'rxjs';
import * as CartActions from '../../../services/store/cart/cart.action';
import { map } from 'rxjs/operators';
import { FormGroup } from '@angular/forms';

@Component({
    selector: 'doo-checkout-shipping',
    templateUrl: './shipping.component.html',
    styleUrls: ['./shipping.component.scss','../cart.component.scss']
  })
  export class CheckoutShippingComponent  {

    cartId$: Observable<any>;
    cartId : string;
    CartSubscription: Subscription;
    addressInfo: FormGroup;
  

    constructor(private store: Store<{ cart: CartState }>) {
        this.cartId$ = store.pipe(select('cart','cartId'));
    }

    ngOnInit() {
        this.CartSubscription = this.cartId$
        .pipe(
          map(x => {
            this.cartId = x;
          })
        )
        .subscribe();
    }

    addressUpdate(form : FormGroup) {
        this.addressInfo = form;
    }

    continueToCheckout() {
        console.log(this.cartId);
        console.log(this.addressInfo);
        this.store.dispatch(CartActions.BeginSetOrderShippingAction({payload :{address : this.addressInfo.value , cartId : this.cartId}}));
    }
  }