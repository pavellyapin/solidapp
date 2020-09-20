import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { Store, select } from '@ngrx/store';
import UserState from 'src/app/services/store/user/user.state';
import * as UserActions from 'src/app/services/store/user/user.action';
import * as CartActions from 'src/app/services/store/cart/cart.action';
import { Actions, ofType } from '@ngrx/effects';
import { Subscription, Observable } from 'rxjs';
import { NavigationService } from 'src/app/services/navigation/navigation.service';
import SettingsState from 'src/app/services/store/settings/settings.state';
import { map } from 'rxjs/operators';
import { Entry } from 'contentful';
import { SEOService } from 'src/app/services/seo/seo.service';
;

@Component({
  selector: 'app-login-page',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit , OnDestroy{

  settings$: Observable<SettingsState>;
  SettingsSubscription: Subscription;
  
  loginPageContent : Entry<any>;
  loading:boolean = false;
  resolution:any;
  bigScreens = new Array('lg' , 'xl' , 'md')
  siteSettings: Entry<any>;
  actionCode : string;
  codeValid : boolean = true;

  errorMessage: string;
  username:any;
  password:any;
  
  subscription :Subscription;
  errorSubscription :Subscription;

  constructor(private router: Router,
              private _actions$: Actions,
              private activatedRoute: ActivatedRoute,
              private store: Store<{ user: UserState , settings : SettingsState}>,
              private navService : NavigationService,
              private changeDetectorRef: ChangeDetectorRef,
              private seoService : SEOService) {

            this.settings$ = store.pipe(select('settings'));
        
  }

  ngOnInit() {
    this.errorMessage = '';
    this.SettingsSubscription = this.settings$
    .pipe(
      map(x => {
        this.siteSettings = x.siteConfig;
        if (x.pages) {
          this.loginPageContent = x.pages.filter(page=>{
            if (page.fields.type == 'login') {
              this.seoService.updateTitle(page.fields.title);
              this.seoService.updateDescription(page.fields.description);
              this.seoService.updateOgUrl(window.location.href);
              return page;
            }
          }).pop();
        }
        this.loading = x.loading;
        this.changeDetectorRef.detectChanges();
        this.resolution = x.resolution;
      })
    )
    .subscribe();

      this.errorSubscription = this._actions$.pipe(ofType(UserActions.ErrorUserAction)).subscribe((x) => {
        if(x["code"] == 'auth/invalid-action-code') {
          this.router.navigateByUrl('login/error');
        }
      });
         
    this.activatedRoute.queryParams
    .subscribe(params => {
      this.codeValid = true;
      this.actionCode = params['oobCode'];
      if (this.actionCode) {
        this.navService.startLoading();
        this.store.dispatch(UserActions.BeginVerifyResetPasswordCodeAction({ payload: this.actionCode }));
      }
    });

    /*this.router.events.subscribe((val) => {
       if (val instanceof NavigationEnd) {

      }
  });*/

    this.subscription = this._actions$.pipe(ofType(UserActions.SuccessGetUserInfoAction)).subscribe(() => {
      this.store.dispatch(UserActions.BeginGetUserAddressInfoAction());
      this.store.dispatch(CartActions.BeginResetCartIdAction());
      this.store.dispatch(CartActions.
        BeginInitializeOrderAction({payload :{cartId : null, 
                                              cart : {cart : null}
                                            }}));
      this.router.navigate(['account/overview']);
      this.navService.finishLoading();
    });
    this.navService.finishLoading();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.errorSubscription.unsubscribe();
  }
}
