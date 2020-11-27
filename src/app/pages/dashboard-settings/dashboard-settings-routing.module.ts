
import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import { DashboardSettingsComponent } from './dashboard-settings.component';

const routes: Routes = [
  {
    path: '',
    data: {shouldReuse: true, key: 'dashboard settings'},
    component: DashboardSettingsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardSettingsRoutingModule {
}
