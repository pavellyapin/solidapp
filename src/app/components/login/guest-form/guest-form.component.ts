import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
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
  
  errorSubscription :Subscription;

  @Output() continueGuestEvent = new EventEmitter();

  constructor(private _actions$: Actions,
              private store: Store<{ user: UserState }>,
              private navService : NavigationService) {

                this.guestForm = new FormGroup({        
                  firstName: new FormControl('' ,Validators.required),
                  lastName: new FormControl('',Validators.required),
                  email: new FormControl('',Validators.required)
              });
        
  }

  ngOnInit() {
    this.errorMessage = '';

    this.errorSubscription = this._actions$.pipe(ofType(UserActions.ErrorUserAction)).subscribe((x) => {
      this.errorMessage = x.message;
    }); 
  }

  continueGuest() {
    if (this.guestForm.valid) {
      this.navService.startLoading();
      this.continueGuestEvent.emit(this.guestForm.value);
    }
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
    this.errorSubscription.unsubscribe();
  }
}
