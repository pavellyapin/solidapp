import { Component, OnInit, OnDestroy, Output, EventEmitter, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import UserState from 'src/app/services/store/user/user.state';
import * as UserActions from 'src/app/services/store/user/user.action';
import { Actions, ofType } from '@ngrx/effects';
import { Subscription } from 'rxjs';
import { NavigationService } from 'src/app/services/navigation/navigation.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
;

@Component({
  selector: 'doo-guest-form',
  templateUrl: './guest-form.component.html',
  styleUrls: ['./guest-form.component.scss'],
})
export class GuestFormComponent implements OnInit , OnDestroy{

  errorMessage: string;
  username:any;
  password:any;

  guestForm: FormGroup;
  loginForm: FormGroup;
  
  errorSubscription :Subscription;

  @Input() isFromLogin : boolean = true;

  @Output() continueGuestEvent = new EventEmitter();

  constructor(private _actions$: Actions,
              private store: Store<{ user: UserState }>,
              private navService : NavigationService) {

                this.loginForm = new FormGroup({        
                    email: new FormControl('' ,Validators.required),
                    password: new FormControl('',Validators.required)
                });

                this.guestForm = new FormGroup({        
                  firstName: new FormControl('' ,Validators.required),
                  lastName: new FormControl('',Validators.required),
                  email: new FormControl('',Validators.required)
              });
        
  }

  ngOnInit() {
    this.errorMessage = '';
    this.errorSubscription = this._actions$.pipe(ofType(UserActions.ErrorUserAction)).subscribe((x) => {
      this.errorMessage = 'There was an error while trying to sign in, please try again or create a new account';
    }); 
  }

  continueGuest() {
    if (this.guestForm.valid) {
      this.navService.startLoading();
      this.continueGuestEvent.emit(this.guestForm.value);
    }
  }

  facebookLogin() {
    this.store.dispatch(UserActions.BeginFacebookUserLoginAction());
  }

  googleLogin() {
    this.store.dispatch(UserActions.BeginGoogleUserLoginAction());
  }
  

  public async login() {
    if (this.loginForm.valid) {
      const creds = { email: this.loginForm.controls["email"].value, password: this.loginForm.controls["password"].value };
      this.store.dispatch(UserActions.BeginUserLoginAction({ payload: creds }));
    } else {
      this.loginForm.updateValueAndValidity();
    }

  }

  ngOnDestroy(): void {
    this.errorSubscription.unsubscribe();
  }
}
