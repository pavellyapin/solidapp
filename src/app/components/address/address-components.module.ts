import { NgModule } from '@angular/core';
import { AutocompleteInputComponent } from './autocomplete-input/autocomplete-input.component';
import { TranslateModule } from '@ngx-translate/core';
import { AddressFormComponent } from './address-form/address.component';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {MatSelectModule} from '@angular/material/select';

@NgModule({
    declarations: [AutocompleteInputComponent,AddressFormComponent],
    imports: [
        CommonModule,
        MatInputModule,
        MatSelectModule,
        MatButtonModule,
        MatIconModule,
        FlexLayoutModule,
        FormsModule,
        ReactiveFormsModule,
        TranslateModule
    ],
    exports: [AddressFormComponent]
  })
  export class AddressComponentsModule {
  }