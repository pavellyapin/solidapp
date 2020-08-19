import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import UserState from 'src/app/services/store/user/user.state';
import * as UserActions from 'src/app/services/store/user/user.action';
import { FormGroup, FormControl, Validators } from '@angular/forms';
;

@Component({
  selector: 'doo-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent implements OnInit , OnDestroy{

  forgotPasswordForm: FormGroup;
  isSubmitted : boolean = false;
  
  constructor(private store: Store<{ user: UserState }>) {

                this.forgotPasswordForm = new FormGroup({        
                  email: new FormControl('',Validators.required)
              });
        
  }

  ngOnInit() {
    
  }

  public async forgotPassword() {
    if(this.forgotPasswordForm.valid) {
      this.isSubmitted = true;
      this.store.dispatch(UserActions.BeginForgotPasswordAction({ payload: this.forgotPasswordForm.controls["email"].value}));
    } else {
      this.forgotPasswordForm.updateValueAndValidity();
    }
  }

  ngOnDestroy(): void {
    
  }
}
