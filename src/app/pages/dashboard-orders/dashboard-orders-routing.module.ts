
import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import { DashboardOrdersComponent } from './dashboard-orders.component';
import { DashboardOrdersOverviewComponent } from './overview/overview.component';
import { DashboardOrderDetailsComponent } from './order-details/order-details.component';


const routes: Routes = [
  {data: {title: 'Orders Dashboard' , isChild: true},
  path: '', 
  children : [
     {data: {title: 'Orders Dashboard' , isChild: true},
     path: '', 
     component: DashboardOrdersOverviewComponent},
     {data: {title: 'Orders Dashboard' , isChild: true},
     path: ':uid', 
     component: DashboardOrdersOverviewComponent},
     {data: {title: 'Orders Dashboard' , isChild: true},
     path: ':orderId/:uid', 
     component: DashboardOrderDetailsComponent}
  ],
  component: DashboardOrdersComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardOrdersRoutingModule {
}
