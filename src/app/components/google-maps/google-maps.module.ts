import { NgModule } from '@angular/core';
import { AutocompleteInputComponent } from './autocomplete-input/autocomplete-input.component';
import { MatInputModule, MatIconModule } from '@angular/material';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
    declarations: [AutocompleteInputComponent],
    imports: [
        MatInputModule,
        MatIconModule,
        TranslateModule
        
    ],
    exports: [AutocompleteInputComponent]
  })
  export class GoogleMapsModule {
  }