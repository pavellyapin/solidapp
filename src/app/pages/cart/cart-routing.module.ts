
import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import { NavRoute } from 'src/app/services/navigation/nav-routing';
import { CartComponent } from './cart.component';
import { CheckoutShippingGuard } from './shipping/shipping.guard';
import { CheckoutShippingComponent } from './shipping/shipping.component';
import { CheckoutPaymentGuard } from './payment/payment.guard';
import { CheckoutPaymentComponent } from './payment/payment.component';
import { GuestCheckoutComponent } from './guest/guest.component';
import { GuestCheckoutGuard } from './guest/guest.guard';

export const catRoutes: NavRoute[] = [
  {data: {title: 'Cart' , isChild: true},
   path: '', 
   children : [
      {data: {title: 'Checkout' , isChild: true},
      path: '', 
      canActivate: [GuestCheckoutGuard],
      component: GuestCheckoutComponent},
      {data: {title: 'Checkout Shipping' , isChild: true},
      path: 'checkout/:cartId/shipping', 
      component: CheckoutShippingComponent},
      {data: {title: 'Checkout Payment' , isChild: true},
      path: 'checkout/:cartId/payment', 
      canActivate: [CheckoutPaymentGuard],
      component: CheckoutPaymentComponent}
   ],
   component: CartComponent}
];

@NgModule({
  imports: [RouterModule.forChild(catRoutes)],
  exports: [RouterModule],
})
export class CartRoutingModule {
}