import {NgModule} from '@angular/core';
import {RouteReuseStrategy, RouterModule, Routes,} from '@angular/router';
import {navRoutes, sideNavPath, dashboardNavPath, dashboardRoutes} from './services/navigation/nav-routing';
import {NavComponent} from './components/nav/nav.component';
import {CustomRouteReuseStrategy} from './services/navigation/nav-reuse-strategy';
import {NavGuard} from './services/navigation/nav.guard';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { DashboardGuard } from './components/dashboard/dashboard.guard';

const routes: Routes = [

  { 
    path: sideNavPath,
    component: NavComponent,
    children: navRoutes,
    canActivateChild: [NavGuard],
    canActivate: [NavGuard],
    canDeactivate: [NavGuard],
  },
  { 
    path: dashboardNavPath,
    component: DashboardComponent,
    children: dashboardRoutes,
    canActivate: [DashboardGuard],
  },
  {
    data: {title: 'Cart' , isChild: true},
    path: 'cart',
    canActivateChild: [NavGuard],
    canActivate: [NavGuard],
    canDeactivate: [NavGuard],
    loadChildren: () =>
      import('./pages/cart/cart.module').then(
        m => m.CartModule,
      )
  },
  {
    data: {title: 'Login', isChild: true},
    path: 'login',
    canActivateChild: [NavGuard],
    canActivate: [NavGuard],
    canDeactivate: [NavGuard],
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
