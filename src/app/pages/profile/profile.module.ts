import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatInputModule} from '@angular/material/input';
import {FlexLayoutModule} from '@angular/flex-layout';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { ProfileComponent } from './profile.component';
import { ProfileRoutingModule } from './profile-routing.module';
import { AccountComponent } from './components/account/account.component';
import { AddressComponentsModule } from '../../components/address/address-components.module';
import { TranslateModule } from '@ngx-translate/core';
import { FavoritesCardComponent } from './components/favorites/product-cards/product-card/product-card.component';
import { FavoritesCardsSpawnerComponent } from './components/favorites/product-cards/product-cards-spawner/product-cards-spawner.component';
import { FavoritesComponent } from './components/favorites/favorites.component';
import { PipesModule } from 'src/app/components/pipes/pipes.module';
import { FavoritesCardsService } from './components/favorites/product-cards/favorites-cards.service';
import { OrdersComponent } from './components/orders/orders.component';
import { OrderDeatilComponent } from './components/orders/order-details/order-detail.component';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';

@NgModule({
  declarations: [ProfileComponent,
                 AccountComponent,
                 FavoritesComponent,
                 OrdersComponent,
                 OrderDeatilComponent,
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
    MatTableModule,
    MatPaginatorModule,
    FlexLayoutModule,
    MatGridListModule,
    FormsModule,
    ReactiveFormsModule,
    AddressComponentsModule,
    TranslateModule
  ],
  providers : [FavoritesCardsService],
  entryComponents: [FavoritesCardComponent]
})
export class ProfileModule {
}
