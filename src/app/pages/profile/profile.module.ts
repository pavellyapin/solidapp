import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatInputModule} from '@angular/material/input';
import {FlexLayoutModule} from '@angular/flex-layout';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { ProfileComponent } from './profile.component';
import { ProfileRoutingModule } from './profile-routing.module';
import { MatTabsModule, MatIconModule, MatSelectModule, MatSidenavModule, MatGridListModule } from '@angular/material';
import { AccountComponent } from './components/account/account.component';
import { AddressComponent } from './components/address/address.component';
import { GoogleMapsModule } from '../../components/google-maps/google-maps.module';
import { TranslateModule } from '@ngx-translate/core';
import { FavoritesCardComponent } from './components/favorites/product-cards/product-card/product-card.component';
import { FavoritesCardsSpawnerComponent } from './components/favorites/product-cards/product-cards-spawner/product-cards-spawner.component';
import { FavoritesComponent } from './components/favorites/favorites.component';
import { PipesModule } from 'src/app/components/pipes/pipes.module';
import { FavoritesCardsService } from './components/favorites/product-cards/favorites-cards.service';
import { OrdersComponent } from './components/orders/orders.component';

@NgModule({
  declarations: [ProfileComponent,
                 AccountComponent,
                 AddressComponent,
                 FavoritesComponent,
                 OrdersComponent,
                 FavoritesCardComponent,
                 FavoritesCardsSpawnerComponent],
  imports: [
    CommonModule,
    PipesModule,
    ProfileRoutingModule,
    MatCardModule,
    MatInputModule,
    MatSelectModule,
    MatSidenavModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    FlexLayoutModule,
    MatGridListModule,
    FormsModule,
    ReactiveFormsModule,
    GoogleMapsModule,
    TranslateModule
  ],
  providers : [FavoritesCardsService],
  entryComponents: [FavoritesCardComponent]
})
export class ProfileModule {
}
