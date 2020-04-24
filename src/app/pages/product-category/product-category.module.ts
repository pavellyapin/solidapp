import {NgModule} from '@angular/core';
import { ProductCategoryComponent } from './product-category.component';
import { CommonModule } from '@angular/common';
import { ProductCategoryRoutingModule } from './product-category-routing.module';
import { ProductCardComponent } from './product-cards/product-card/product-card.component';
import { ProductCardsSpawnerComponent } from './product-cards/product-cards-spawner/product-cards-spawner.component';
import { TranslateModule } from '@ngx-translate/core';
import { MatGridListModule, MatButtonModule, MatCardModule, MatIconModule, MatListModule } from '@angular/material';
import { ProductCardsService } from './product-cards/product-cards.service';
import { FlexLayoutModule } from '@angular/flex-layout';
import { PipesModule } from 'src/app/components/pipes/pipes.module';
import { NavModule } from 'src/app/components/nav/nav.module';


@NgModule({
  declarations: [ProductCategoryComponent,ProductCardComponent,ProductCardsSpawnerComponent],
  imports: [
    CommonModule,
    PipesModule,
    NavModule,
    ProductCategoryRoutingModule,
    TranslateModule,
    MatGridListModule,
    MatButtonModule,
    MatCardModule,
    MatListModule,
    MatIconModule,
    FlexLayoutModule
  ],
  providers: [ProductCardsService],
  entryComponents: [ProductCardComponent]
})
export class ProductCategoryModule {
}
