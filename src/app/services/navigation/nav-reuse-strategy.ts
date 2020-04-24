import {ActivatedRouteSnapshot, DetachedRouteHandle, RouteReuseStrategy,} from '@angular/router';

export class CustomRouteReuseStrategy implements RouteReuseStrategy {
  handlers: { [key: string]: DetachedRouteHandle } = {};

  private static isReusable(route: ActivatedRouteSnapshot) {
    return route.data && route.data.shouldReuse;
  }

  private static getKey(route: ActivatedRouteSnapshot) {
    return route.data.key;
  }

  private static shouldReuse(route: ActivatedRouteSnapshot) {
    return CustomRouteReuseStrategy.isReusable(route);
  }

  shouldDetach(route: ActivatedRouteSnapshot): boolean {
    return CustomRouteReuseStrategy.shouldReuse(route) || false;
  }

  store(route: ActivatedRouteSnapshot, handle: {}): void {
    if (CustomRouteReuseStrategy.shouldReuse(route)) {
      this.setHandler(route, handle);
    }
  }

  shouldAttach(route: ActivatedRouteSnapshot): boolean {
    return this.hasHandler(route);
  }

  retrieve(route: ActivatedRouteSnapshot): {} {
    return this.getHandler(route);
  }

  shouldReuseRoute(
    future: ActivatedRouteSnapshot,
    curr: ActivatedRouteSnapshot,
  ): boolean {
    return (
      future.routeConfig === curr.routeConfig || CustomRouteReuseStrategy.shouldReuse(future)
    );
  }

  private setHandler(
    route: ActivatedRouteSnapshot,
    handle: DetachedRouteHandle,
  ) {
    this.handlers[CustomRouteReuseStrategy.getKey(route)] = handle;
  }

  private getHandler(route: ActivatedRouteSnapshot) {
    return this.handlers[CustomRouteReuseStrategy.getKey(route)];
  }

  private hasHandler(route: ActivatedRouteSnapshot) {
    return !!this.getHandler(route);
  }
}
