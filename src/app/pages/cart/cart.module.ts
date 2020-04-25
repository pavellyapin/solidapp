import {NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MatButtonModule, 
         MatIconModule, 
         MatRadioModule,
         MatInputModule,
         MatCardModule,
         MatGridListModule,
         MatDialogModule} from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';
import { PipesModule } from 'src/app/components/pipes/pipes.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CartRoutingModule } from './cart-routing.module';
import { CartComponent, PayPalModalComponent } from './cart.component';
import { CartCardComponent } from './cart-cards/cart-card/cart-card.component';
import { CartCardsSpawnerComponent } from './cart-cards/cart-cards-spawner/cart-cards-spawner.component';
import { CartCardsService } from './cart-cards/product-cards.service';
import { CheckoutSuccessComponent } from './success/success.component';
import { VariantsPipe } from 'src/app/components/pipes/pipes';
import { PaidCartCardComponent } from './cart-cards/paid-cart-card/paid-cart-card.component';


@NgModule({
  declarations: [CartComponent,
                 CartCardComponent,
                 PaidCartCardComponent,
                 CartCardsSpawnerComponent,
                 PayPalModalComponent,
                 CheckoutSuccessComponent],
  imports: [
    CommonModule,
    CartRoutingModule,
    PipesModule,
    FormsModule,
    ReactiveFormsModule,
    MatGridListModule,
    TranslateModule,
    MatDialogModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatRadioModule,
    MatInputModule,
    FlexLayoutModule
  ],
  providers: [CartCardsService,VariantsPipe],
  entryComponents: [CartCardComponent,PaidCartCardComponent,PayPalModalComponent]
})
export class CartModule {
}
