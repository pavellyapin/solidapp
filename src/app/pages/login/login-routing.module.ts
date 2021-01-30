import {LoginComponent} from './login.component';

import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import { ForgotPasswordComponent } from 'src/app/components/login/forgot-password/forgot-password.component';
import { NavRoute } from 'src/app/services/navigation/nav-routing';
import { ResetPasswordComponent } from 'src/app/components/login/reset-password/reset-password.component';
import { RegisterFormComponent } from 'src/app/components/login/register-form/register-form.component';
import { GuestFormComponent } from 'src/app/components/login/guest-form/guest-form.component';
import { LoginErrorComponent } from 'src/app/components/login/error/error.component';

export const loginRoutes: NavRoute[] = [
  {data: {title: 'Login' , isChild: false},
   path: '', 
   children : [
      {data: {title: 'Login Page' , isChild: true},
      path: '', 
      component: GuestFormComponent},
      {data: {title: 'Forgot Password' , isChild: true},
      path: 'forgotpassword', 
      component: ForgotPasswordComponent},
      {data: {title: 'Reset Password' , isChild: true},
      path: 'passwordreset', 
      component: ResetPasswordComponent},
      {data: {title: 'Register User' , isChild: true},
      path: 'createuser', 
      component: RegisterFormComponent},
      {data: {title: 'Login Error' , isChild: true},
      path: 'error', 
      component: LoginErrorComponent},
   ],
   component: LoginComponent}
];

@NgModule({
  imports: [RouterModule.forChild(loginRoutes)],
  exports: [RouterModule],
})
export class LoginRoutingModule {
}
