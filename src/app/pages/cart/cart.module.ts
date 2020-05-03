import {NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { PipesModule } from 'src/app/components/pipes/pipes.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CartRoutingModule } from './cart-routing.module';
import { CartComponent } from './cart.component';
import { CartCardComponent } from './cart-cards/cart-card/cart-card.component';
import { CartCardsSpawnerComponent } from './cart-cards/cart-cards-spawner/cart-cards-spawner.component';
import { CartCardsService } from './cart-cards/product-cards.service';
import { CheckoutSuccessComponent } from './success/success.component';
import { VariantsPipe } from 'src/app/components/pipes/pipes';
import { PaidCartCardComponent } from './cart-cards/paid-cart-card/paid-cart-card.component';
import { AddressComponentsModule } from 'src/app/components/address/address-components.module';
import { CheckoutShippingComponent } from './shipping/shipping.component';
import { CartCheckoutComponent } from './checkout/checkout.component';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { MatGridListModule } from '@angular/material/grid-list';
import {MatDialogModule} from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {MatRadioModule} from '@angular/material/radio';
import { MatInputModule } from '@angular/material/input';
import {CartService} from './cart.service';
import { CheckoutPaymentComponent, PayPalModalComponent } from './payment/payment.component';
import { MatExpansionModule } from '@angular/material/expansion';


@NgModule({
  declarations: [CartComponent,
                 CartCardComponent,
                 PaidCartCardComponent,
                 CartCardsSpawnerComponent,
                 PayPalModalComponent,
                 CheckoutSuccessComponent,
                 CheckoutShippingComponent,
                 CartCheckoutComponent,
                 CheckoutPaymentComponent],
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
    MatExpansionModule,
    MatButtonModule,
    MatIconModule,
    MatRadioModule,
    MatInputModule,
    FlexLayoutModule,
    AddressComponentsModule,
    LazyLoadImageModule
  ],
  providers: [CartCardsService,VariantsPipe,CartService],
  entryComponents: [CartCardComponent,PaidCartCardComponent,PayPalModalComponent]
})
export class CartModule {
}
