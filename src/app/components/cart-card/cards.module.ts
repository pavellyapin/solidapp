import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { PipesModule } from '../pipes/pipes.module';
import { TranslateModule } from '@ngx-translate/core';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { FlexLayoutModule } from '@angular/flex-layout';
import { CartCardsSpawnerComponent } from './cart-cards-spawner/cart-cards-spawner.component';
import { FashionCartCardComponent } from './fashion-layout/cart-card-fashion.component';
import { CartCardComponent } from './cart-card.component';
import { CartItemsComponent } from './cart-items/cart-items.component';
import { MatGridListModule } from '@angular/material/grid-list';


@NgModule({
    declarations: [CartCardsSpawnerComponent,
                   FashionCartCardComponent,
                   CartCardComponent,
                   CartItemsComponent],
    imports: [
      MatIconModule,
      CommonModule,
      PipesModule,
      TranslateModule,
      LazyLoadImageModule,
      FlexLayoutModule,
      MatGridListModule
    ],
    providers :[],
    exports : [CartCardsSpawnerComponent,CartItemsComponent]
  })
  export class CartCardsModule {
  }