
import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import { NavRoute } from 'src/app/services/navigation/nav-routing';
import { CartComponent } from './cart.component';
import { CheckoutShippingGuard } from './shipping/shipping.guard';
import { CheckoutShippingComponent } from './shipping/shipping.component';
import { CartCheckoutComponent } from './checkout/checkout.component';
import { CheckoutPaymentGuard } from './payment/payment.guard';
import { CheckoutPaymentComponent } from './payment/payment.component';
import { CheckoutSuccessGuard } from './success/success.guard';
import { CheckoutSuccessComponent } from './success/success.component';

export const catRoutes: NavRoute[] = [
  {data: {title: 'Cart' , isChild: true},
   path: '', 
   children : [
      {data: {title: 'Checkout' , isChild: true},
      path: '', 
      component: CartCheckoutComponent},
      {data: {title: 'Checkout Shipping' , isChild: true},
      path: 'checkout/shipping', 
      canActivate: [CheckoutShippingGuard],
      component: CheckoutShippingComponent},
      {data: {title: 'Checkout Payment' , isChild: true},
      path: 'checkout/payment', 
      canActivate: [CheckoutPaymentGuard],
      component: CheckoutPaymentComponent}],
   component: CartComponent},
   
      {data: {title: 'Checkout Success' , isChild: true},
      path: 'checkout/success/:order', 
      canActivate: [CheckoutSuccessGuard],
      component: CheckoutSuccessComponent}
    
  /* {data: {title: 'Checkout Success' , isChild: true},
   path: 'checkout/success/:order', 
   canActivate: [CheckoutSuccessGuard],
   component: CheckoutSuccessComponent}*/
];

@NgModule({
  imports: [RouterModule.forChild(catRoutes)],
  exports: [RouterModule],
})
export class CartRoutingModule {
}