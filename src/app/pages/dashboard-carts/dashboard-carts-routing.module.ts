
import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import { DashboardCartsOverviewComponent } from './overview/overview.component';
import { DashboardCartsComponent } from './dashboard-carts.component';
import { DashboardCartsGuard } from './dashboard-carts.guard';
import { DashboardCartDetailsComponent } from './cart-details/cart-details.component';

const routes: Routes = [
  {data: {title: 'Carts Dashboard' , isChild: true},
  path: '', 
  canActivateChild : [DashboardCartsGuard],
  children : [
     {data: {title: 'Carts Dashboard' , isChild: true},
     path: '', 
     canActivate: [DashboardCartsGuard],
     component: DashboardCartsOverviewComponent},
     {data: {title: 'Cart Details' , isChild: true},
     path: ':cartId/:uid', 
     component: DashboardCartDetailsComponent}
  ],
  component: DashboardCartsComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardCartsRoutingModule {
}
