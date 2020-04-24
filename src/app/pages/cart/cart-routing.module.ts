
import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import { NavRoute } from 'src/app/services/navigation/nav-routing';
import { CartComponent } from './cart.component';
import { CheckoutSuccessComponent } from './success/success.component';
import { CheckoutSuccessGuard } from './success/success.guard';

export const catRoutes: NavRoute[] = [
  {data: {title: 'Cart' , isChild: true},
   path: '', 
   component: CartComponent},
   {data: {title: 'Checkout Success' , isChild: true},
   path: 'checkout/success/:order', 
   canActivate: [CheckoutSuccessGuard],
   component: CheckoutSuccessComponent}
];

@NgModule({
  imports: [RouterModule.forChild(catRoutes)],
  exports: [RouterModule],
})
export class CartRoutingModule {
}