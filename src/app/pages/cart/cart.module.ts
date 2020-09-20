import {NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { PipesModule } from 'src/app/components/pipes/pipes.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CartRoutingModule } from './cart-routing.module';
import { CartComponent } from './cart.component';
import { AddressComponentsModule } from 'src/app/components/address/address-components.module';
import { CheckoutShippingComponent, CartShippingModalComponent } from './shipping/shipping.component';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import {MatDialogModule} from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {MatRadioModule} from '@angular/material/radio';
import { MatInputModule } from '@angular/material/input';
import { CheckoutPaymentComponent, PayPalModalComponent } from './payment/payment.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSelectModule } from '@angular/material/select';
import { CartCardsModule } from 'src/app/components/cart-card/cards.module';
import { LoginComponentsModule } from 'src/app/components/login/login-components.module';
import { GuestCheckoutComponent } from './guest/guest.component';
import { FooterModule } from 'src/app/components/footer/footer.module';
import { MatSidenavModule } from '@angular/material/sidenav';
import { ImagePipe } from 'src/app/components/pipes/pipes';
import { CartErrorComponent } from './error/error.component';
import { MatDividerModule } from '@angular/material/divider';


@NgModule({
  declarations: [CartComponent,
                 GuestCheckoutComponent,
                 PayPalModalComponent,
                 CartShippingModalComponent,
                 CheckoutShippingComponent,
                 CheckoutPaymentComponent,
                 CartErrorComponent],
  imports: [
    CommonModule,
    CartRoutingModule,
    PipesModule,
    FormsModule,
    FooterModule,
    ReactiveFormsModule,
    TranslateModule,
    MatDialogModule,
    MatCardModule,
    MatExpansionModule,
    MatSelectModule,
    MatSidenavModule,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    MatRadioModule,
    MatInputModule,
    FlexLayoutModule,
    AddressComponentsModule,
    CartCardsModule,
    LazyLoadImageModule,
    LoginComponentsModule
  ],
  providers: [ImagePipe],
  entryComponents: [PayPalModalComponent,CartShippingModalComponent]
})
export class CartModule {
}
