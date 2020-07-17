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

@NgModule({
  declarations: [CheckoutSuccessComponent],
  imports: [
    CommonModule,
    PipesModule,
    OrderRoutingModule,
    MatCardModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    FlexLayoutModule,
    FormsModule,
    TranslateModule,
    LazyLoadImageModule
  ],
})
export class OrderModule {
}
