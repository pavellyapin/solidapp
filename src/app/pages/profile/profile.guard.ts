import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, first } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/auth';
import { Store } from '@ngrx/store';
import * as SettingsActions from 'src/app/services/store/settings/settings.action';

@Injectable({
  providedIn: 'root',
})
export class ProfileGuard implements CanActivate {
  
  constructor(private router: Router,public afAuth: AngularFireAuth,private store: Store<{}>) {
  }

  canActivate(): Observable<boolean> {
    return this.afAuth.authState.pipe(
      (map(user => {
        if (!user) {
          this.store.dispatch(SettingsActions.SuccessLoadingAction());
          this.router.navigate(['login'])
        }
        return true;
      }))
    );
  }
}
