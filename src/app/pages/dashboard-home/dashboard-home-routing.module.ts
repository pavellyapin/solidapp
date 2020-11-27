
import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import { DashboardHomeComponent } from './dashboard-home.component';

const routes: Routes = [
  {
    path: '',
    data: {shouldReuse: true, key: 'dashboard home'},
    component: DashboardHomeComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardHomeRoutingModule {
}
