
import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import { NavRoute } from 'src/app/services/navigation/nav-routing';
import { CartComponent } from './cart.component';
import { CheckoutShippingComponent } from './shipping/shipping.component';
import { CheckoutPaymentGuard } from './payment/payment.guard';
import { CheckoutPaymentComponent } from './payment/payment.component';
import { GuestCheckoutComponent } from './guest/guest.component';
import { CartErrorComponent } from './error/error.component';
import { CartAuthGuard } from './cart-auth.guard';

export const cartRoutes: NavRoute[] = [
  {data: {title: 'Cart' , isChild: true},
   canActivate : [CartAuthGuard],
   canActivateChild : [CartAuthGuard],
   canDeactivate: [CartAuthGuard],
   path: '', 
   children : [
      {data: {title: 'guest' , isChild: true},
      path: '', 
      component: GuestCheckoutComponent},
      {data: {title: 'shipping' , isChild: true},
      path: 'checkout/:cartId/shipping', 
      component: CheckoutShippingComponent},
      {data: {title: 'payment' , isChild: true},
      path: 'checkout/:cartId/payment', 
      canActivate: [CheckoutPaymentGuard],
      component: CheckoutPaymentComponent},
      {data: {title: 'Checkout Error' , isChild: true},
      path: 'checkout/:cartId/error', 
      component: CartErrorComponent},
   ],
   component: CartComponent}
];

@NgModule({
  imports: [RouterModule.forChild(cartRoutes)],
  exports: [RouterModule],
})
export class CartRoutingModule {
}