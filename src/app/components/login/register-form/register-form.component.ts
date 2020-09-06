import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import UserState from 'src/app/services/store/user/user.state';
import * as UserActions from 'src/app/services/store/user/user.action';
import { Actions, ofType } from '@ngrx/effects';
import { Subscription } from 'rxjs';
import { FormGroup, FormControl, Validators } from '@angular/forms';
;

@Component({
  selector: 'doo-register-form',
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.scss'],
})
export class RegisterFormComponent implements OnInit , OnDestroy{

  errorMessage: string;
  registerForm: FormGroup;
  pwStrong : boolean = false;
  showInfo : boolean = false;
  errorSubscription :Subscription;

  constructor(private _actions$: Actions,
              private store: Store<{ user: UserState }>) {

                this.registerForm = new FormGroup({   
                    email: new FormControl('' ,Validators.required),
                    password: new FormControl('',Validators.required)
                });
        
  }

  ngOnInit() {
    this.errorMessage = '';
    this.errorSubscription = this._actions$.pipe(ofType(UserActions.ErrorUserAction)).subscribe((x) => {
      this.errorMessage = x.message;
    }); 
  }

  facebookLogin() {
    this.store.dispatch(UserActions.BeginFacebookUserLoginAction());
  }

  googleLogin() {
    this.store.dispatch(UserActions.BeginGoogleUserLoginAction());
  }
  

  public async registerNewUser() {
    if (this.registerForm.valid && this.pwStrong) {
      const creds = { email: this.registerForm.controls["email"].value, password: this.registerForm.controls["password"].value };
      this.store.dispatch(UserActions.BeginRegisterUserAction({ payload: creds }));
    } else {
      this.showInfo = true;
      this.registerForm.updateValueAndValidity();
    }
  }

  pwStrengthChange($event) {
    if ($event==100) {
      this.pwStrong = true;
    }
  }

  ngOnDestroy(): void {
    this.errorSubscription.unsubscribe();
  }
}
