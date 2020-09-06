import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivateChild, RouterStateSnapshot, UrlTree, Router,} from '@angular/router';
import {Observable} from 'rxjs';
import {NavigationService} from "./navigation.service";
import {sideNavPath} from "./nav-routing";
import { map } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/auth';
import { UtilitiesService } from '../util/util.service';

@Injectable({
  providedIn: 'root',
})
export class NavGuard implements CanActivateChild {
  
  constructor(private navigationService: NavigationService,
              public afAuth: AngularFireAuth,
              private utils : UtilitiesService,
              private router: Router) {
  }

  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
      return this.afAuth.authState.pipe(map((auth)=> {
        this.utils.scrollTop();

        if (childRoute.data.title == 'Profile' && (!auth || auth.isAnonymous)) {
          this.router.navigate(['login']);
        }

        if (childRoute.data.title == 'Login' && auth && !auth.isAnonymous) {
          this.router.navigate(['account/overview']);
        }
        
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
      }));

  }
}
