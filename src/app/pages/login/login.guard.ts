import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Store, select } from '@ngrx/store';
import UserState from 'src/app/services/store/user/user.state';
import { map } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoginGuard implements CanActivate {

  personalInfo : any;

  constructor(
    private store: Store<{ user: UserState }>,
    public afAuth: AngularFireAuth) {
      store.pipe(select('user' , 'personalInfo'))
      .pipe(
        map(x => {
          this.personalInfo = x;
        })
      ).subscribe();
  }

  canActivate(): Observable<any> {
    return this.afAuth.authState.pipe(map((auth)=> {
      return true;
    }));
  }
}
