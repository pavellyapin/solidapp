
import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import { CheckoutSuccessGuard } from './success/success.guard';
import { CheckoutSuccessComponent } from './success/success.component';

const routes: Routes = [
     {data: {title: 'Checkout Success' , isChild: true},
      path: 'success/:order', 
      canActivate: [CheckoutSuccessGuard],
      component: CheckoutSuccessComponent}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrderRoutingModule {
}
