import {Route, Router} from '@angular/router';
import {Injectable} from '@angular/core';

export interface NavRoute extends Route {
  path?: string;
  icon?: string;
  group?: string;
  groupedNavRoutes?: NavRoute[];
}

export const sideNavPath = '';
export const dashboardNavPath = 'store';

export const dashboardRoutes: NavRoute[] = [
  {
    data: {title: 'Dashboard Home'},
    path: '',
    loadChildren: () =>
      import('../../pages/dashboard-home/dashboard-home.module').then(
        m => m.DashboardHomeModule,
      )
  },
  {
    data: {title: 'Dashboard Settings'},
    path: 'settings',
    loadChildren: () =>
      import('../../pages/dashboard-settings/dashboard-settings.module').then(
        m => m.DashboardSettingsModule,
      )
  },
  {
    data: {title: 'Dashboard Orders'},
    path: 'orders',
    loadChildren: () =>
      import('../../pages/dashboard-orders/dashboard-orders.module').then(
        m => m.DashboardOrdersModule,
      )
  },
  {
    data: {title: 'Dashboard Customers'},
    path: 'customers',
    loadChildren: () =>
      import('../../pages/dashboard-customers/dashboard-customers.module').then(
        m => m.DashboardCustomersModule,
      )
  },
  {
    data: {title: 'Dashboard Carts'},
    path: 'carts',
    loadChildren: () =>
      import('../../pages/dashboard-carts/dashboard-carts.module').then(
        m => m.DashboardCartsModule,
      )
  },
  {
    data: {title: 'Dashboard Subscriptions'},
    path: 'subscriptions',
    loadChildren: () =>
      import('../../pages/dashboard-subscriptions/dashboard-subscriptions.module').then(
        m => m.DashboardSubscriptionsModule,
      )
  }
]

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
    data: {title: 'Custom Page'},
    path: 'page',
    loadChildren: () =>
      import('../../pages/custom/custom.module').then(
        m => m.CustomModule,
      ),
  },
  {
    data: {title: 'Profile' , isChild: false},
    path: 'account',
    loadChildren: () =>
      import('../../pages/profile/profile.module').then(
        m => m.ProfileModule,
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
    data: {title: 'Search' , isChild: true},
    path: 'search',
    loadChildren: () =>
      import('../../pages/search/search.module').then(
        m => m.SearchModule,
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
    data: {title: 'Order' , isChild: true},
    path: 'order',
    loadChildren: () =>
      import('../../pages/order/order.module').then(
        m => m.OrderModule,
      )
  }
];

@Injectable({
  providedIn: 'root',
})
export class NavRouteService {
  navRoute: Route;
  navRoutes: NavRoute[];

  constructor(public router: Router) {
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
