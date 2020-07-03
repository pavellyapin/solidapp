import {NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { PipesModule } from 'src/app/components/pipes/pipes.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CartRoutingModule } from './cart-routing.module';
import { CartComponent } from './cart.component';
import { VariantsPipe } from 'src/app/components/pipes/pipes';
import { AddressComponentsModule } from 'src/app/components/address/address-components.module';
import { CheckoutShippingComponent } from './shipping/shipping.component';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import {MatDialogModule} from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {MatRadioModule} from '@angular/material/radio';
import { MatInputModule } from '@angular/material/input';
import {CartService} from './cart.service';
import { CheckoutPaymentComponent, PayPalModalComponent } from './payment/payment.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { CheckoutSuccessComponent } from './success/success.component';
import { MatSelectModule } from '@angular/material/select';
import { CartCardsModule } from 'src/app/components/cart-card/cards.module';


@NgModule({
  declarations: [CartComponent,
                 PayPalModalComponent,
                 CheckoutSuccessComponent,
                 CheckoutShippingComponent,
                 CheckoutPaymentComponent],
  imports: [
    CommonModule,
    CartRoutingModule,
    PipesModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    MatDialogModule,
    MatCardModule,
    MatExpansionModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatRadioModule,
    MatInputModule,
    FlexLayoutModule,
    AddressComponentsModule,
    CartCardsModule,
    LazyLoadImageModule
  ],
  providers: [VariantsPipe,CartService],
  entryComponents: [PayPalModalComponent]
})
export class CartModule {
}
