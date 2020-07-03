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
import { ProductDeatilStandardLayoutComponent } from './standard-layout/fashion-layout.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { ProductReviewsComponent, WriteReviewModalComponent } from './product-reviews/product-reviews.component';
import { CardsModule } from 'src/app/components/cards/cards.module';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { MatDialogModule } from '@angular/material/dialog';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { WidgetsModule } from 'src/app/components/widgets/widgets.module';
import { BlockLayoutsModule } from 'src/app/components/block-layouts/block-layouts.module';


@NgModule({
  declarations: [ProductDeatilComponent,
                 ProductDeatilFashionLayoutComponent,
                 ProductDeatilStandardLayoutComponent,
                 ProductReviewsComponent,
                 WriteReviewModalComponent],
  imports: [
    CommonModule,
    PipesModule,
    NavModule,
    FormsModule,
    CardsModule,
    WidgetsModule,
    ReactiveFormsModule,
    TranslateModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatRadioModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatExpansionModule,
    MatDialogModule,
    MatInputModule,
    FlexLayoutModule,
    ProductDetailRoutingModule,
    NgxImageZoomModule,
    BlockLayoutsModule
  ],
  providers: [],
  entryComponents: [WriteReviewModalComponent]
})
export class ProductDetailModule {
}
