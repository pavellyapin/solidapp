import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType} from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import * as UserActions from './user.action';
import * as CartActions from '../cart/cart.action';
import { AuthService } from '../../auth/auth.service';
import { FirestoreService } from '../../firestore/firestore.service';

@Injectable()
export class UserEffects {
  constructor(
    private action$: Actions, 
    private authService: AuthService,
    private firestoreService: FirestoreService) {}

  GetUserInfo$: Observable<Action> = createEffect(() =>
    this.action$.pipe(
      ofType(UserActions.BeginGetUserInfoAction),
      switchMap(action =>
        this.firestoreService.getUserPersonalInfo().pipe(
          map((data: any) => {
            return UserActions.SuccessGetUserInfoAction({ payload: data.payload.data()});
          }),
          catchError((error: Error) => {
            return of(UserActions.ErrorUserAction(error));
          })
        )
      )
    )
  );

  GetSiteInfo$: Observable<Action> = createEffect(() =>
  this.action$.pipe(
    ofType(UserActions.BeginGetSiteInfoAction),
    switchMap(action =>
      this.firestoreService.getUserSiteInfo().pipe(
        map((data: any) => {
          return UserActions.SuccessGetSiteInfoAction({ payload: data.payload.data()});
        }),
        catchError((error: Error) => {
          return of(UserActions.ErrorUserAction(error));
        })
      )
    )
  )
);

GetUserPermissions$: Observable<Action> = createEffect(() =>
this.action$.pipe(
  ofType(UserActions.BeginGetUserPermissionsAction),
  switchMap(action =>
    this.firestoreService.getUserPermissions().pipe(
      map((data: any) => {
        return UserActions.SuccessGetUserPermissionsAction({ payload: data.payload.data()});
      }),
      catchError((error: Error) => {
        return of(UserActions.ErrorUserAction(error));
      })
    )
  )
)
);

  GetUserAddressInfo$: Observable<Action> = createEffect(() =>
  this.action$.pipe(
    ofType(UserActions.BeginGetUserAddressInfoAction),
    switchMap(action =>
      this.firestoreService.getUserAddressInfo().pipe(
        map((data: any) => {
          return UserActions.SuccessGetUserAddressInfoAction({ payload: data.payload.data()});
        }),
        catchError((error: Error) => {
          return of(UserActions.ErrorUserAction(error));
        })
      )
    )
  )
);

  UserLogin$: Observable<Action> = createEffect(() =>
  this.action$.pipe(
    ofType(UserActions.BeginUserLoginAction),
    switchMap(action =>
      this.authService.doLogin(action.payload.email,action.payload.password).pipe(
        switchMap((x) => [CartActions.BeginResetCartIdAction(),
                          UserActions.BeginGetUserInfoAction(),
                          UserActions.BeginGetUserPermissionsAction(),
                          UserActions.BeginSetUserIDAction({ payload: x.user.uid}),
                          UserActions.BeginGetUserAddressInfoAction()]
        ),
        catchError((error: Error) => {
          return of(UserActions.ErrorUserAction(error));
        })
      )
    )
  )
);

RedirectLogin$: Observable<Action> = createEffect(() =>
this.action$.pipe(
  ofType(UserActions.BeginLoginWithRedirectAction),
  switchMap(action =>
    this.authService.signInWithRedirect(action.payload).pipe(
      switchMap((x) => [UserActions.SuccessLoginWithRedirectAction()]
      ),
      catchError((error: Error) => {
        return of(UserActions.ErrorUserAction(error));
      })
    )
  )
)
);

GetRedirectResult$: Observable<Action> = createEffect(() =>
this.action$.pipe(
  ofType(UserActions.BeginGetRedirectResultAction),
  switchMap(action =>
    this.authService.getRedirectResult().pipe(
      switchMap((x) => 
       [CartActions.BeginResetCartIdAction(),
        UserActions.BeginGetUserInfoAction(),
        UserActions.BeginGetUserPermissionsAction(),
        UserActions.BeginSetUserIDAction({ payload: x.user.uid}),
        UserActions.BeginGetUserAddressInfoAction()]
      ),
      catchError((error: Error) => {
        return of(UserActions.ErrorUserAction(error));
      })
    )
  )
)
);

  UserGoogleLogin$: Observable<Action> = createEffect(() =>
  this.action$.pipe(
    ofType(UserActions.BeginGoogleUserLoginAction),
    switchMap(action =>
      this.authService.doLoginWithGoogle().pipe(
        switchMap((x) => [CartActions.BeginResetCartIdAction(),
                          UserActions.BeginGetUserInfoAction(),
                          UserActions.BeginGetUserPermissionsAction(),
                          UserActions.BeginSetUserIDAction({ payload: x.user.uid}),
                          UserActions.BeginGetUserAddressInfoAction()]
        ),
        catchError((error: Error) => {
          return of(UserActions.ErrorUserAction(error));
        })
      )
    )
  )
);

  UserFacebookLogin$: Observable<Action> = createEffect(() =>
  this.action$.pipe(
    ofType(UserActions.BeginFacebookUserLoginAction),
    switchMap(action =>
      this.authService.doLoginWithFacebook().pipe(
        switchMap((x) => [CartActions.BeginResetCartIdAction(),
                          UserActions.BeginGetUserInfoAction(),
                          UserActions.BeginGetUserPermissionsAction(),
                          UserActions.BeginSetUserIDAction({ payload: x.user.uid}),
                          UserActions.BeginGetUserAddressInfoAction()]
        ),
        catchError((error: Error) => {
          return of(UserActions.ErrorUserAction(error));
        })
      )
    )
  )
);


  RegisterUser$: Observable<Action> = createEffect(() =>
  this.action$.pipe(
    ofType(UserActions.BeginRegisterUserAction),
    switchMap(action =>
      this.authService.doRegister(action.payload.email,action.payload.password).pipe(
        switchMap((x) => [CartActions.BeginResetCartIdAction(),
                          UserActions.BeginGetUserInfoAction(),
                          UserActions.BeginGetUserPermissionsAction(),
                          UserActions.BeginSetUserIDAction({ payload: x.user.uid}),
                          UserActions.BeginGetUserAddressInfoAction()]
),
        catchError((error: Error) => {
          return of(UserActions.ErrorUserAction(error));
        })
      )
    )
  )
);

UpdatePersonalInfo$: Observable<Action> = createEffect(() =>
    this.action$.pipe(
      ofType(UserActions.BeginUpdatePerosnalInfoUserAction),
      switchMap(action =>
        this.firestoreService.
          updateUserName(action.payload.get("firstName").value,
                         action.payload.get("lastName").value).pipe(
          map(() => {
            return UserActions.BeginGetUserInfoAction();
          }),
          catchError((error: Error) => {
            return of(UserActions.ErrorUserAction(error));
          })
        )
      )
    )
  );

  UpdateUserPassword$: Observable<Action> = createEffect(() =>
    this.action$.pipe(
      ofType(UserActions.BeginUpdatePasswordAction),
      switchMap(action =>
        this.authService.updatePassword(action.payload.get("oldPassword").value,action.payload.get("newPassword").value).pipe(
          map(() => {
            return UserActions.SuccessUpdatePasswordAction();
          }),
          catchError((error: Error) => {
            return of(UserActions.ErrorUserAction(error));
          })
        )
      )
    )
  );

  ForgotPassword$: Observable<Action> = createEffect(() =>
  this.action$.pipe(
    ofType(UserActions.BeginForgotPasswordAction),
    switchMap(action =>
      this.authService.forgotPassword(action.payload).pipe(
        map(() => {
          return UserActions.SuccessForgotPasswordAction();
        }),
        catchError((error: Error) => {
          return of(UserActions.ErrorUserAction(error));
        })
      )
    )
  )
);

  VerifyPasswordResetCode$: Observable<Action> = createEffect(() =>
  this.action$.pipe(
    ofType(UserActions.BeginVerifyResetPasswordCodeAction),
    switchMap(action =>
      this.authService.verifyPasswordResetCode(action.payload).pipe(
        map((res) => {
          return UserActions.SuccessVerifyResetPasswordCodeAction(res);
        }),
        catchError((error: Error) => {
          return of(UserActions.ErrorUserAction(error));
        })
      )
    )
  )
);

ConfirmPasswordReset$: Observable<Action> = createEffect(() =>
this.action$.pipe(
  ofType(UserActions.BeginConfirmPasswordResetAction),
  switchMap(action =>
    this.authService.confirmPasswordReset(action.payload.code , action.payload.newPassword).pipe(
      map((res) => {
        return UserActions.SuccessConfirmPasswordResetAction(res);
      }),
      catchError((error: Error) => {
        return of(UserActions.ErrorUserAction(error));
      })
    )
  )
)
);


  UpdateUserEmail: Observable<Action> = createEffect(() =>
  this.action$.pipe(
      ofType(UserActions.BeginUpdateUserEmailAction),
      switchMap(action =>
        this.firestoreService.updateUserEmail(action.payload.get("email").value).pipe(
          map((data: any) => {
            if (data.code == 400) {
              return UserActions.BeginUpdateUserContactInfoAction(action);
            } else {
              return UserActions.ErrorUserAction(data.message);
            }
          }),
          catchError((error: Error) => {
            return of(UserActions.ErrorUserAction(error));
          })
        )
      )
    )
  );

  SubscribeEmail: Observable<Action> = createEffect(() =>
  this.action$.pipe(
      ofType(UserActions.BeginSubscribeEmailAction),
      switchMap(action =>
        this.firestoreService.subscribe(action.payload.get("email").value).pipe(
          map((data: any) => {
            if (data.code == 400) {
              return UserActions.SuccessSubscribeEmailAction();
            } else {
              return UserActions.ErrorUserAction(data.message);
            }
          }),
          catchError((error: Error) => {
            return of(UserActions.ErrorUserAction(error));
          })
        )
      )
    )
  );

  UpdateUserContactInfo: Observable<Action> = createEffect(() =>
    this.action$.pipe(
        ofType(UserActions.BeginUpdateUserContactInfoAction),
        switchMap(action =>
          this.firestoreService.
          updateUserContact(action.payload.get("email").value,
                         action.payload.get("phone").value).pipe(
            map(() => {
              return UserActions.BeginGetUserInfoAction();
            }),
            catchError((error: Error) => {
              return of(UserActions.ErrorUserAction(error));
            })
          )
        )
      )
    );

    UpdateUserAddressInfo: Observable<Action> = createEffect(() =>
    this.action$.pipe(
        ofType(UserActions.BeginUpdateUserAddressInfoAction),
        switchMap(action =>
          this.firestoreService.
          updateUserAddress(action.payload.addressLine1,
                            action.payload.addressLine2,
                            action.payload.city,
                            action.payload.province,
                            action.payload.postal).pipe(
            map(() => {
              return UserActions.BeginGetUserAddressInfoAction();
            }),
            catchError((error: Error) => {
              return of(UserActions.ErrorUserAction(error));
            })
          )
        )
      )
    );


  UserLogout$: Observable<Action> = createEffect(() =>
  this.action$.pipe(
    ofType(UserActions.BeginUserLogoutAction),
    switchMap(action =>
      this.authService.doLogout().pipe(
        map(() => {
          return UserActions.SuccessUserLogoutAction();
        }),
        catchError((error: Error) => {
          return of(UserActions.ErrorUserAction(error));
        })
      )
    )
  )
);

    //Favorites----------------------------------------------------

    AddProductToFavorites: Observable<Action> = createEffect(() =>
    this.action$.pipe(
        ofType(UserActions.BeginAddToFavoritesAction),
        switchMap(action =>
          this.firestoreService.
          addToFavorites(action.payload).pipe(
            map(() => {
              return UserActions.BeginGetFavoritesAction();
            }),
            catchError((error: Error) => {
              return of(UserActions.ErrorUserAction(error));
            })
          )
        )
      )
    );

    RemoveFromFavorites: Observable<Action> = createEffect(() =>
    this.action$.pipe(
        ofType(UserActions.BeginRemoveFromFavoritesAction),
        switchMap(action =>
          this.firestoreService.
          removeFromFavorites(action.payload).pipe(
            map(() => {
              return UserActions.SuccessRemoveFromFavoritesAction();
            }),
            catchError((error: Error) => {
              return of(UserActions.ErrorUserAction(error));
            })
          )
        )
      )
    );

    GetFavorites$: Observable<Action> = createEffect(() =>
    this.action$.pipe(
      ofType(UserActions.BeginGetFavoritesAction),
      switchMap(action =>
        this.firestoreService.getFavorites().pipe(
          map((data: any) => {
            let favorites = Array<any>();
            data.forEach(element => {
              favorites.push({ product: element.payload.doc.data() , docId : element.payload.doc.id});
            });
            return UserActions.SuccessGetFavoritesAction({ payload: favorites});
          }),
          catchError((error: Error) => {
            return of(UserActions.ErrorUserAction(error));
          })
        )
      )
    )
  );


  //Orders----------------------------------------------------
    GetOrders$: Observable<Action> = createEffect(() =>
    this.action$.pipe(
      ofType(UserActions.BeginGetOrdersAction),
      switchMap(action =>
        this.firestoreService.getOrders().pipe(
          map((data: any) => {
            let orders = Array<any>();
            data.forEach(element => {
              let x = element.data();
              x.id = element.id;
              orders.push(x);
            });
            return UserActions.SuccessGetOrdersAction({ payload: orders});
          }),
          catchError((error: Error) => {
            return of(UserActions.ErrorUserAction(error));
          })
        )
      )
    )
  );

  }
