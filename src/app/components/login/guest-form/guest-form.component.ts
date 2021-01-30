import { Component, OnInit, OnDestroy, Output, EventEmitter, Input } from '@angular/core';
import { Store, select } from '@ngrx/store';
import UserState from 'src/app/services/store/user/user.state';
import * as UserActions from 'src/app/services/store/user/user.action';
import { Actions, ofType } from '@ngrx/effects';
import { Subscription, Observable } from 'rxjs';
import { NavigationService } from 'src/app/services/navigation/navigation.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UtilitiesService } from 'src/app/services/util/util.service';
import SettingsState from 'src/app/services/store/settings/settings.state';
import { map } from 'rxjs/operators';
import { Entry } from 'contentful';
import { environment } from 'src/environments/environment';
;

@Component({
  selector: 'doo-guest-form',
  templateUrl: './guest-form.component.html',
  styleUrls: ['./guest-form.component.scss'],
})
export class GuestFormComponent implements OnInit , OnDestroy{

  settings$: Observable<SettingsState>;
  SettingsSubscription: Subscription;
  resolution:any;
  
  pageContent : Entry<any>;
  
  errorMessage: string;
  username:any;
  password:any;

  loginForm: FormGroup;

  enableGoogleLogin = environment.enableGoogleLogin;
  enableFacebookLogin = environment.enableFacebookLogin;
  
  errorSubscription :Subscription;

  @Input() isFromLogin : boolean = true;

  @Output() continueGuestEvent = new EventEmitter();

  constructor(private _actions$: Actions,
              private store: Store<{ user: UserState , settings : SettingsState }>,
              private navService : NavigationService,
              public utils : UtilitiesService) {

                this.loginForm = new FormGroup({        
                    email: new FormControl('' ,Validators.required),
                    password: new FormControl('',Validators.required)
                });

              this.settings$ = store.pipe(select('settings'));
        
  }

  ngOnInit() {
    this.errorMessage = '';
    this.errorSubscription = this._actions$.pipe(ofType(UserActions.ErrorUserAction)).subscribe((x) => {
      this.errorMessage = 'There was an error while trying to sign in, please try again or create a new account';
    }); 

    this.SettingsSubscription = this.settings$
    .pipe(
      map(x => {
        this.resolution = x.resolution;
        if (x.pages && !this.isFromLogin) {
          this.pageContent = x.pages.filter(page=>{
            if (page.fields.type == 'cart') {
              return page;
            }
          }).pop();
        }
      })
    )
    .subscribe();
  }

  continueGuest() {
    this.continueGuestEvent.emit();
  }

  facebookLogin() {
    if(this.utils.deviceService.isMobile() || this.utils.deviceService.isTablet()) {
      this.store.dispatch(UserActions.BeginLoginWithRedirectAction({payload : 'facebook'}));
    } else {
      this.store.dispatch(UserActions.BeginFacebookUserLoginAction());
    }
    
  }

  googleLogin() {
    if(this.utils.deviceService.isMobile() || this.utils.deviceService.isTablet()) {
      this.store.dispatch(UserActions.BeginLoginWithRedirectAction({payload : 'google'}));
    } else {
      this.store.dispatch(UserActions.BeginGoogleUserLoginAction());
    }
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
