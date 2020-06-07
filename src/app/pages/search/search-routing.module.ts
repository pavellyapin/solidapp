
import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import { NavRoute } from 'src/app/services/navigation/nav-routing';
import { SearchComponent } from './search.component';
import { SearchGuard } from './search.guard';

export const catRoutes: NavRoute[] = [
  {data: {title: 'Sub Category' , isChild: true},
   path: ':key', 
   component: SearchComponent,
   canActivate: [SearchGuard] 
   }
];

@NgModule({
  imports: [RouterModule.forChild(catRoutes)],
  exports: [RouterModule],
})
export class SearchRoutingModule {
}
