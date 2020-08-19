import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {LoginRoutingModule} from './login-routing.module';
import {LoginComponent} from './login.component';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatInputModule} from '@angular/material/input';
import {FlexLayoutModule} from '@angular/flex-layout';
import {FormsModule} from '@angular/forms';
import { LoginComponentsModule } from 'src/app/components/login/login-components.module';
import { FooterModule } from 'src/app/components/footer/footer.module';
import { BlockLayoutsModule } from 'src/app/components/block-layouts/block-layouts.module';

@NgModule({
  declarations: [LoginComponent],
  imports: [
    CommonModule,
    LoginRoutingModule,
    MatCardModule,
    FooterModule,
    MatInputModule,
    MatButtonModule,
    FlexLayoutModule,
    FormsModule,
    LoginComponentsModule,
    BlockLayoutsModule
  ],
})
export class LoginModule {
}
