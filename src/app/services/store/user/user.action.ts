import { createAction, props } from '@ngrx/store';
import User from './user.model';
import { FormGroup } from '@angular/forms';


//User Login

export const UserLoginAction = createAction(
  '[User] - Login',
  props<User>()
);

export const BeginUserLoginAction = createAction(
  '[User] - Begin Login',
  props<{ payload: any }>()
);

export const SuccessUserLoginAction = createAction(
  '[User] - Success Login'
);

export const BeginGetUserInfoAction = createAction(
  '[User] - Begin Get User Info'
);

export const SuccessGetUserInfoAction = createAction(
  '[User] - Success Login & Get User Info',
  props<{ payload: any}>()
);

//User Logout

export const BeginUserLogoutAction = createAction(
  '[User] - Begin Logout'
);

export const SuccessUserLogoutAction = createAction(
  '[User] - Success Logout'
);

//User Register

export const BeginRegisterUserAction = createAction(
  '[User] - Begin Register',
  props<{ payload: any }>()
);

export const SuccessRegisterUserAction = createAction(
  '[User] - Success Register',
  props<{ payload: User }>()
);


//Update Personal Info

export const BeginUpdatePerosnalInfoUserAction = createAction(
  '[User] - Begin Update Personal Info',
  props<{ payload: FormGroup }>()
);

export const SuccessUpdatePerosnalInfoUserAction = createAction(
  '[User] - Success Update Personal Info'
);

//Update Contact Info

export const BeginUpdateUserEmailAction = createAction(
  '[User] - Begin Update User Email',
  props<{ payload: FormGroup }>()
);

export const BeginUpdateUserContactInfoAction = createAction(
  '[User] - Begin Update Contact Info',
  props<{ payload: FormGroup }>()
);

//Update Password

export const BeginUpdatePasswordAction = createAction(
  '[User] - Begin Update User Password',
  props<{ payload: FormGroup }>()
);

export const SuccessUpdatePasswordAction = createAction(
  '[User] - Success Update User Password'
);

//Address information

export const BeginUpdateUserAddressInfoAction = createAction(
  '[User] - Begin Update Address Info',
  props<{ payload: FormGroup }>()
);

export const BeginGetUserAddressInfoAction = createAction(
  '[User] - Begin Get Address Info'
);

export const SuccessGetUserAddressInfoAction = createAction(
  '[User] - Success Get Address Info',
  props<{ payload: any}>()
);

// Favorites

export const BeginAddToFavoritesAction = createAction(
  '[User] - Begin Add to Favorites',
  props<{ payload: any }>()
);

export const SuccessAddToFavoritesAction = createAction(
  '[User] - Success Add to Favs'
);

export const BeginRemoveFromFavoritesAction = createAction(
  '[User] - Begin remove from Favorites',
  props<{ payload: any }>()
);

export const SuccessRemoveFromFavoritesAction = createAction(
  '[User] - Success Remove from Favs'
);

export const BeginGetFavoritesAction = createAction(
  '[User] - Begin Get Favorites'
);

export const SuccessGetFavoritesAction = createAction(
  '[User] - Success Get Favorites',
  props<{ payload: any}>()
);

//Orders

export const BeginGetOrdersAction = createAction(
  '[User] - Begin Get Orders'
);

export const SuccessGetOrdersAction = createAction(
  '[User] - Success Get Orders',
  props<{ payload: any}>()
);

//Subscribe 

export const BeginSubscribeEmailAction = createAction(
  '[User] - Begin Subscribe Email',
  props<{ payload: any}>()
);

export const SuccessSubscribeEmailAction = createAction(
  '[User] - Success Subscribe Email'
);

export const ErrorUserAction = createAction('[User] - Error', props<Error>());
