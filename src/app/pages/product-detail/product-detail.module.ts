import {NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MatButtonModule, 
         MatIconModule, 
         MatRadioModule,
         MatInputModule} from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';
import { PipesModule } from 'src/app/components/pipes/pipes.module';
import { ProductDeatilComponent } from './product-detail.component';
import { ProductDetailRoutingModule } from './product-detail-routing.module';
import { NavModule } from 'src/app/components/nav/nav.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [ProductDeatilComponent],
  imports: [
    CommonModule,
    PipesModule,
    NavModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    MatButtonModule,
    MatIconModule,
    MatRadioModule,
    MatInputModule,
    FlexLayoutModule,
    ProductDetailRoutingModule
  ],
  providers: [],
  entryComponents: []
})
export class ProductDetailModule {
}
