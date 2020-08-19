import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import UserState from 'src/app/services/store/user/user.state';
import * as UserActions from 'src/app/services/store/user/user.action';
import { Actions, ofType } from '@ngrx/effects';
import { Subscription } from 'rxjs';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
;

@Component({
  selector: 'doo-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent implements OnInit , OnDestroy{
  
  errorMessage: string;
  errorSubscription :Subscription;
  successSubscription :Subscription;

  resetPasswordForm: FormGroup;
  pwStrong : boolean = false;
  showInfo : boolean = false;
  actionCode: string; 
  isSubmitted : boolean = false;
  
  constructor(private _actions$: Actions,
              private activatedRoute: ActivatedRoute,
              private store: Store<{ user: UserState }>) {

                this.resetPasswordForm = new FormGroup({        
                  newPassword: new FormControl('',Validators.required),
                  confirmPassword: new FormControl('',Validators.required)
              });
        
  }

  ngOnInit() {
    this.errorMessage = '';
    this.errorSubscription = this._actions$.pipe(ofType(UserActions.ErrorUserAction)).subscribe((x) => {
      this.errorMessage = x.message;
    }); 

    this.successSubscription = this._actions$.pipe(ofType(UserActions.SuccessConfirmPasswordResetAction)).subscribe((x) => {
      this.isSubmitted =true;
    }); 

    this.activatedRoute.queryParams
    .subscribe(params => {
      this.actionCode = params['oobCode'];
    });
  }

  pwStrengthChange($event) {
    if ($event==100) {
      this.pwStrong = true;
    }
  }
  
  public async resetPassword() {
    if (this.resetPasswordForm.valid && this.pwStrong 
        && this.resetPasswordForm.controls["newPassword"].value == this.resetPasswordForm.controls["confirmPassword"].value) {
      this.store.dispatch(UserActions.
        BeginConfirmPasswordResetAction({ payload: {code :  this.actionCode,  newPassword : this.resetPasswordForm.controls["newPassword"].value} }));
    } else {
      this.showInfo = true;
      this.errorMessage = 'Something went wrong, make sure passwords match and security rules are satisfied';
    }
  }

  ngOnDestroy(): void {
    this.errorSubscription.unsubscribe();
    this.successSubscription.unsubscribe();
  }
}
