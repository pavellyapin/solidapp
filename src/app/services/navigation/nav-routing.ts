import {Route, Router} from '@angular/router';
import {Injectable} from '@angular/core';
import { LoginGuard } from 'src/app/pages/login/login.guard';
import { ProfileGuard } from 'src/app/pages/profile/profile.guard';

export interface NavRoute extends Route {
  path?: string;
  icon?: string;
  group?: string;
  groupedNavRoutes?: NavRoute[];
}

export const sideNavPath = '';

export const navRoutes: NavRoute[] = [
  {
    data: {title: 'Home'},
    path: '',
    loadChildren: () =>
      import('../../pages/home/home.module').then(
        m => m.HomeModule,
      ),
  },
  {
    data: {title: 'Profile' , isChild: false},
    path: 'account',
    canActivate: [ProfileGuard],
    loadChildren: () =>
      import('../../pages/profile/profile.module').then(
        m => m.ProfileModule,
      ),
  },
  {
    data: {title: 'Login'},
    path: 'login',
    canActivate: [LoginGuard],
    loadChildren: () =>
      import('../../pages/login/login.module').then(
        m => m.LoginModule,
      ),
  },
  {
    data: {title: 'Category' , isChild: true},
    path: 'cat',
    loadChildren: () =>
      import('../../pages/product-category/product-category.module').then(
        m => m.ProductCategoryModule,
      )
  },
  {
    data: {title: 'Product' , isChild: true},
    path: 'product',
    loadChildren: () =>
      import('../../pages/product-detail/product-detail.module').then(
        m => m.ProductDetailModule,
      )
  },
  {
    data: {title: 'Cart' , isChild: true},
    path: 'cart',
    loadChildren: () =>
      import('../../pages/cart/cart.module').then(
        m => m.CartModule,
      )
  }
];

@Injectable({
  providedIn: 'root',
})
export class NavRouteService {
  navRoute: Route;
  navRoutes: NavRoute[];

  constructor(router: Router) {
    this.navRoute = router.config.find(route => route.path === sideNavPath);
    this.navRoutes = this.navRoute.children
      .filter(route => route.data)
      .reduce((groupedList: NavRoute[], route: NavRoute) => {
        if (route.group) {
          const group: NavRoute = groupedList.find(navRoute => {
            return (
              navRoute.group === route.group &&
              navRoute.groupedNavRoutes !== undefined
            );
          });
          if (group) {
            group.groupedNavRoutes.push(route);
          } else {
            groupedList.push({
              group: route.group,
              groupedNavRoutes: [route],
            });
          }
        } else {
          groupedList.push(route);
        }
        return groupedList;
      }, []);
  }

  public getNavRoutes(): NavRoute[] {
    return this.navRoutes;
  }
}
