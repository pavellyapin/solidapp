import {NgModule} from '@angular/core';
import {RouteReuseStrategy, RouterModule, Routes,} from '@angular/router';
import {navRoutes, sideNavPath, dashboardNavPath, dashboardRoutes} from './services/navigation/nav-routing';
import {NavComponent} from './components/nav/nav.component';
import {CustomRouteReuseStrategy} from './services/navigation/nav-reuse-strategy';
import {NavGuard} from './services/navigation/nav.guard';
import { DashboardComponent } from './components/dashboard/dashboard.component';

const routes: Routes = [

  { 
    path: sideNavPath,
    component: NavComponent,
    children: navRoutes,
    canActivateChild: [NavGuard],
  },
  { 
    path: dashboardNavPath,
    component: DashboardComponent,
    children: dashboardRoutes,
    canActivateChild: [NavGuard],
  },
  {
    data: {title: 'Cart' , isChild: true},
    path: 'cart',
    canActivateChild: [NavGuard],
    loadChildren: () =>
      import('./pages/cart/cart.module').then(
        m => m.CartModule,
      )
  },
  {
    data: {title: 'Login', isChild: true},
    path: 'login',
    canActivateChild: [NavGuard],
    loadChildren: () =>
      import('./pages/login/login.module').then(
        m => m.LoginModule,
      ),
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
