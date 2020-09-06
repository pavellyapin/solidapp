import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatInputModule} from '@angular/material/input';
import {FlexLayoutModule} from '@angular/flex-layout';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { GuestFormComponent } from './guest-form/guest-form.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { TranslateModule } from '@ngx-translate/core';
import { NameFormComponent } from './name-form/name-form.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { RouterModule } from '@angular/router';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { MatPasswordStrengthModule } from '@angular-material-extensions/password-strength';
import { RegisterFormComponent } from './register-form/register-form.component';
import { LoginErrorComponent } from './error/error.component';
import { BlockLayoutsModule } from '../block-layouts/block-layouts.module';

@NgModule({
  declarations: [GuestFormComponent,
                 NameFormComponent,
                 ForgotPasswordComponent,
                 ResetPasswordComponent,
                 RegisterFormComponent,
                 LoginErrorComponent],
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule,
    MatCheckboxModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    MatPasswordStrengthModule,
    BlockLayoutsModule
  ],
  exports : [GuestFormComponent,
             NameFormComponent,
             ForgotPasswordComponent,
             ResetPasswordComponent,
             RegisterFormComponent,
             LoginErrorComponent]
})
export class LoginComponentsModule {
}
