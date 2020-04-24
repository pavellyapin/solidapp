import {NgModule} from '@angular/core';
import {RouteReuseStrategy, RouterModule, Routes,} from '@angular/router';
import {navRoutes, sideNavPath} from './services/navigation/nav-routing';
import {NavComponent} from './components/nav/nav.component';
import {CustomRouteReuseStrategy} from './services/navigation/nav-reuse-strategy';
import {NavGuard} from './services/navigation/nav.guard';

const routes: Routes = [

  { 
    path: sideNavPath,
    component: NavComponent,
    children: navRoutes,
    canActivateChild: [NavGuard],
  },
  {
    path: '**',
    redirectTo: 'login',
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
  ],
  exports: [RouterModule],
  providers: [
    {provide: RouteReuseStrategy, useClass: CustomRouteReuseStrategy},
  ],
})
export class AppRoutingModule {
}
