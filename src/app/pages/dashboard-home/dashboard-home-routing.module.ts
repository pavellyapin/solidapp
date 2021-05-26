
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardHomeComponent } from './dashboard-home.component';
import { DashboardHomeGuard } from './dashboard-home.guard';

const routes: Routes = [
  {
    path: 'overview',
    canActivate: [DashboardHomeGuard],
    canDeactivate: [DashboardHomeGuard],
    data: { shouldReuse: false, key: 'dashboard home' },
    component: DashboardHomeComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardHomeRoutingModule {
}
