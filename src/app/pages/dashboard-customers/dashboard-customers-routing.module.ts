
import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import { DashboardCustomersComponent } from './dashboard-customers.component';
import { DashboardCustomerDetailsComponent } from './customer-details/customer-details.component';
import { DashboardCustomersOverviewComponent } from './overview/overview.component';
import { DashboardCustomersGuard } from './dashboard-customers.guard';

const routes: Routes = [
  {data: {title: 'Customer Dashboard' , isChild: true},
  path: '', 
  canActivateChild : [DashboardCustomersGuard],
  children : [
     {data: {title: 'Customer Dashboard' , isChild: true},
     path: '',
     canActivate: [DashboardCustomersGuard], 
     component: DashboardCustomersOverviewComponent},
     {data: {title: 'Customer Dashboard' , isChild: true},
     path: ':uid', 
     component: DashboardCustomerDetailsComponent}
  ],
  component: DashboardCustomersComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardCustomersRoutingModule {
}
