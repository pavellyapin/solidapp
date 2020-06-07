import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { PipesModule } from '../pipes/pipes.module';
import { MatButtonModule } from '@angular/material/button';
import { MoreFromCatCarouselComponent } from './more-from-cat-carousel/more-from-cat-carousel.component';
import { WidgetsComponent } from './widgets.component';
import { CardsModule } from '../cards/cards.module';
import { ProductCardsService } from './more-from-cat-carousel/product-cards.service';

@NgModule({
    declarations: [MoreFromCatCarouselComponent,
                   WidgetsComponent],
    imports: [
        CommonModule,
        PipesModule,
        CardsModule,
        FlexLayoutModule,
        MatButtonModule,
    ],
    providers: [ProductCardsService],
    exports: [MoreFromCatCarouselComponent,
              WidgetsComponent]
  })
  export class WidgetsModule {
  }