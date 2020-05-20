import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { Store } from '@ngrx/store';
import UserState from 'src/app/services/store/user/user.state';
import * as UserActions from 'src/app/services/store/user/user.action';
import * as CartActions from 'src/app/services/store/cart/cart.action';
import { Actions, ofType } from '@ngrx/effects';
import { Subscription } from 'rxjs';
import { NavigationService } from 'src/app/services/navigation/navigation.service';
;

@Component({
  selector: 'app-login-page',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit , OnDestroy{

  errorMessage: string;
  username:any;
  password:any;
  
  subscription :Subscription;

  constructor(private authService: AuthService,
              private router: Router,
              private _actions$: Actions,
              private store: Store<{ user: UserState }>,
              private navService : NavigationService) {
        
  }

  ngOnInit() {
    this.errorMessage = '';
    //this.navService.popFromStack();
    this.navService.resetStack(['account']);
    if (!this.authService.isLoggedIn()) {
      this.navigateTo();
    }

    this.subscription = this._actions$.pipe(ofType(UserActions.SuccessGetUserInfoAction)).subscribe(() => {
      this.store.dispatch(UserActions.BeginGetUserAddressInfoAction());
      this.store.dispatch(CartActions.BeginResetCartIdAction());
      this.router.navigate(['']);
      this.navService.finishLoading();
    });
  }

  ngAfterViewInit() {
    this.navService.finishLoading();
  }
  

  public async login(username: string, pw: string) {

    const creds = { email: username, password: pw };
    this.navService.startLoading();
    this.store.dispatch(UserActions.BeginUserLoginAction({ payload: creds }));
  }

  public async register(username: string, pw: string) {
    this.navService.startLoading();
    const creds = { email: username, password: pw };
    this.store.dispatch(UserActions.BeginRegisterUserAction({ payload: creds }));
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public navigateTo(url?: string) {
    url = url || 'nav';
    this.router.navigate([url], { replaceUrl: true });
  }
}
