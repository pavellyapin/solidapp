import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivateChild, RouterStateSnapshot, UrlTree,} from '@angular/router';
import {Observable} from 'rxjs';
import {NavigationService} from "./navigation.service";
import {sideNavPath} from "./nav-routing";

@Injectable({
  providedIn: 'root',
})
export class NavGuard implements CanActivateChild {
  
  constructor(private navigationService: NavigationService) {
  }

  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    if (childRoute.data && childRoute.data.title) {
      const parentPath: string = childRoute.parent.url
        .map(url => url.path)
        .join('/');

      if (parentPath === sideNavPath) {
        this.navigationService.selectNavigationItemByPath(
          childRoute.url.map(url => url.path).join('/'),
        );
      }
      
      this.navigationService.setActivePage(
        childRoute.data.title,
        childRoute.url.map(url => url.path),
        childRoute.data.isChild,
      );
    }
    return true;
  }
}
