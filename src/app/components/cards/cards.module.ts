import { NgModule } from '@angular/core';
import { ReviewStarsComponent } from './review-stars/review-stars.component';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { ProductCarouselComponent } from './product-carousel/product-carousel.component';
import { PipesModule } from '../pipes/pipes.module';
import { ProductCardComponent } from './product-card/product-card.component';
import { TranslateModule } from '@ngx-translate/core';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FashionProductCardComponent } from './product-card/fashion-layout/product-card-fashion.component';
import { ProductCardsSpawnerComponent } from './product-card/product-cards-spawner/product-cards-spawner.component';
import { JQ_TOKEN } from 'src/app/services/util/jQuery.service';
import { StandardProductCardComponent } from './product-card/standard-layout/product-card-standard.component';

export let jQuery = (typeof window !== "undefined") ? window['$'] : null;

@NgModule({
    declarations: [ReviewStarsComponent,
                   ProductCarouselComponent,
                   ProductCardComponent,
                   FashionProductCardComponent,
                   StandardProductCardComponent,
                   ProductCardsSpawnerComponent],
    imports: [
      MatIconModule,
      CommonModule,
      PipesModule,
      TranslateModule,
      LazyLoadImageModule,
      FlexLayoutModule,
    ],
    providers :[],
    exports : [ReviewStarsComponent,ProductCarouselComponent,ProductCardsSpawnerComponent]
  })
  export class CardsModule {
  }