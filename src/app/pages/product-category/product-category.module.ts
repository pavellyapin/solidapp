import {NgModule} from '@angular/core';
import { ProductCategoryComponent } from './product-category.component';
import { CommonModule } from '@angular/common';
import { ProductCategoryRoutingModule } from './product-category-routing.module';
import { TranslateModule } from '@ngx-translate/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { PipesModule } from 'src/app/components/pipes/pipes.module';
import { NavModule } from 'src/app/components/nav/nav.module';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatExpansionModule } from '@angular/material/expansion';
import {MatChipsModule} from '@angular/material/chips';
import {MatSelectModule} from '@angular/material/select';
import { CardsModule } from 'src/app/components/cards/cards.module';


@NgModule({
  declarations: [ProductCategoryComponent],
  imports: [
    CommonModule,
    PipesModule,
    NavModule,
    CardsModule,
    MatSidenavModule,
    ProductCategoryRoutingModule,
    TranslateModule,
    MatGridListModule,
    MatButtonModule,
    MatCardModule,
    MatListModule,
    MatIconModule,
    MatChipsModule,
    MatCheckboxModule,
    MatExpansionModule,
    MatSelectModule,
    FlexLayoutModule,
    LazyLoadImageModule
  ],
  providers: [],
  entryComponents: []
})
export class ProductCategoryModule {
}
