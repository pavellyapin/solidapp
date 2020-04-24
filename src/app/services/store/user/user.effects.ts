import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType} from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import * as UserActions from './user.action';
import { AuthService } from '../../auth/auth.service';
import User from './user.model';
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

  RegisterUser$: Observable<Action> = createEffect(() =>
  this.action$.pipe(
    ofType(UserActions.BeginRegisterUserAction),
    switchMap(action =>
      this.authService.doRegister(action.payload.email,action.payload.password).pipe(
        map((data: any) => {
          let newUser:User = {
            uid: data.user.uid,
            personalInfo : {firstName: '' , lastName: '' , phone : '' , email : action.payload.email}
          }
          this.firestoreService.createUser(newUser);
          return UserActions.BeginGetUserInfoAction();
        }),
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
          updateUserAddress(action.payload.get("addressLine1").value,
                            action.payload.get("addressLine2").value,
                            action.payload.get("city").value,
                            action.payload.get("province").value,
                            action.payload.get("postal").value).pipe(
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

    //Favorites
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

  }
