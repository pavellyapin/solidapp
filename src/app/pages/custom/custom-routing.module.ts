
import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import { CustomComponent } from './custom.component';

const routes: Routes = [
  {
    path: ':page',
    component: CustomComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CustomRoutingModule {
}
