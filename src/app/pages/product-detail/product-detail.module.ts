import {NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { PipesModule } from 'src/app/components/pipes/pipes.module';
import { ProductDeatilComponent } from './product-detail.component';
import { ProductDetailRoutingModule } from './product-detail-routing.module';
import { NavModule } from 'src/app/components/nav/nav.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import { MatInputModule } from '@angular/material/input';
import { ProductDeatilFashionLayoutComponent } from './fashion-layout/fashion-layout.component';
import { NgxImageZoomModule } from 'ngx-image-zoom';


@NgModule({
  declarations: [ProductDeatilComponent,
                 ProductDeatilFashionLayoutComponent],
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
    ProductDetailRoutingModule,
    NgxImageZoomModule
  ],
  providers: [],
  entryComponents: []
})
export class ProductDetailModule {
}
