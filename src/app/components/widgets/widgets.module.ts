import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { PipesModule } from '../pipes/pipes.module';
import { MatButtonModule } from '@angular/material/button';
import { MoreFromCatCarouselComponent } from './more-from-cat-carousel/more-from-cat-carousel.component';
import { SubscribeComponent } from './subscribe/subscribe.component';
import { WidgetsComponent } from './widgets.component';
import { CardsModule } from '../cards/cards.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MatInputModule } from '@angular/material/input';
import { FeaturedProductsComponent } from './featured-products/featured-products.component';
import { BlockLayoutsModule } from '../block-layouts/block-layouts.module';
import { BlockCarouselComponent } from './block-carousel/block-carousel.component';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
    declarations: [MoreFromCatCarouselComponent,
                   SubscribeComponent,
                   WidgetsComponent,
                   FeaturedProductsComponent,
                   BlockCarouselComponent],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        PipesModule,
        CardsModule,
        BlockLayoutsModule,
        FlexLayoutModule,
        MatButtonModule,
        MatInputModule,
        MatIconModule,
        TranslateModule
    ],
    providers: [],
    exports: [MoreFromCatCarouselComponent,
              SubscribeComponent,
              WidgetsComponent]
  })
  export class WidgetsModule {
  }