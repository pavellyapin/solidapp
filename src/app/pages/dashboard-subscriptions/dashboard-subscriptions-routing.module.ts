
import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import { DashboardSubscriptionsGuard } from './dashboard-subscriptions.guard';
import { DashboardSubscriptionsOverviewComponent } from './overview/overview.component';
import { DashboardSubscriptionDetailsComponent } from './subscription-details/subscription-details.component';
import { DashboardSubscriptionsComponent } from './dashboard-subscriptions.component';

const routes: Routes = [
  {data: {title: 'Subscriptions Dashboard' , isChild: true},
  path: '', 
  canActivateChild : [DashboardSubscriptionsGuard],
  children : [
     {data: {title: 'Subscriptions Dashboard' , isChild: true},
     path: '', 
     canActivate: [DashboardSubscriptionsGuard],
     component: DashboardSubscriptionsOverviewComponent},
     {data: {title: 'Subscription Details' , isChild: true},
     path: ':subscriptionId/:uid', 
     component: DashboardSubscriptionDetailsComponent}
  ],
  component: DashboardSubscriptionsComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardSubscriptionsRoutingModule {
}
