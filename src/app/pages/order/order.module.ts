import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatInputModule} from '@angular/material/input';
import {FlexLayoutModule} from '@angular/flex-layout';
import {FormsModule} from '@angular/forms';
import { OrderRoutingModule } from './order-routing.module';
import { CheckoutSuccessComponent } from './success/success.component';
import { TranslateModule } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';
import { PipesModule } from 'src/app/components/pipes/pipes.module';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { BlockLayoutsModule } from 'src/app/components/block-layouts/block-layouts.module';
import { WidgetsModule } from 'src/app/components/widgets/widgets.module';
import { CartCardsModule } from 'src/app/components/cart-card/cards.module';
import { MatDividerModule } from '@angular/material/divider';

@NgModule({
  declarations: [CheckoutSuccessComponent],
  imports: [
    CommonModule,
    PipesModule,
    OrderRoutingModule,
    MatCardModule,
    MatIconModule,
    MatInputModule,
    MatDividerModule,
    MatButtonModule,
    FlexLayoutModule,
    FormsModule,
    TranslateModule,
    LazyLoadImageModule,
    BlockLayoutsModule,
    WidgetsModule,
    CartCardsModule
  ],
})
export class OrderModule {
}
