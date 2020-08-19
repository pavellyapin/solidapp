import { Component } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { Actions, ofType } from '@ngrx/effects';
import * as UserActions from 'src/app/services/store/user/user.action';
import { Store, select } from '@ngrx/store';
import UserState from 'src/app/services/store/user/user.state';
import { map } from 'rxjs/operators';

@Component({
  selector: 'doo-login-error-password',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss'],
})
export class LoginErrorComponent {

  errorMessage: string;
  errorSubscription :Subscription;
  error$: Observable<Error>;
  
  constructor(private store: Store<{ user: UserState}>,) {
    this.error$ = store.pipe(select('user','UserError'));
  }

  ngOnInit() {
    this.errorMessage = '';
    this.errorSubscription = this.error$
    .pipe(
      map(x => {
        this.errorMessage = x.message;
      })
    )
    .subscribe();
  }

  ngOnDestroy(): void {
    this.errorSubscription.unsubscribe();
  }

}
