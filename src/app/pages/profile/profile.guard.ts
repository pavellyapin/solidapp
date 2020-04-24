import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, first } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root',
})
export class ProfileGuard implements CanActivate {
  
  constructor(private router: Router,public afAuth: AngularFireAuth) {
  }

  canActivate(): Observable<boolean> {
    return this.afAuth.authState.pipe(first()).pipe(
      (map(user => {
        if (!user) {
          this.router.navigate(['login'])
        }
        return true;
      }))
    );
  }
}
