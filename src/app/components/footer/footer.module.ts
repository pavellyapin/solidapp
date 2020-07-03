import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { FooterComponent } from './footer.component';
import { PipesModule } from '../pipes/pipes.module';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
    declarations: [FooterComponent],
    imports: [
      MatIconModule,
      FormsModule,
      ReactiveFormsModule,
      CommonModule,
      PipesModule,
      TranslateModule,
      MatButtonModule,
      MatInputModule,
      FlexLayoutModule,
    ],
    providers :[],
    exports : [FooterComponent]
  })
  export class FooterModule {
  }