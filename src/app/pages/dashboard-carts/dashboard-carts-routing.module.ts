
import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import { DashboardCartsOverviewComponent } from './overview/overview.component';
import { DashboardCartsComponent } from './dashboard-carts.component';

const routes: Routes = [
  {data: {title: 'Carts Dashboard' , isChild: true},
  path: '', 
  children : [
     {data: {title: 'Carts Dashboard' , isChild: true},
     path: '', 
     component: DashboardCartsOverviewComponent}
  ],
  component: DashboardCartsComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardCartsRoutingModule {
}
