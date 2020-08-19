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
import { FavoritesComponent } from './components/favorites/favorites.component';
import { PipesModule } from 'src/app/components/pipes/pipes.module';
import { OrdersComponent } from './components/orders/orders.component';
import { OrderDeatilComponent } from './components/orders/order-details/order-detail.component';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import { AccountOverviewComponent } from './components/overview/account.component';
import { CardsModule } from 'src/app/components/cards/cards.module';
import { ProfileAddressComponent } from './components/address/address.component';

@NgModule({
  declarations: [ProfileComponent,
                 AccountOverviewComponent,
                 AccountComponent,
                 FavoritesComponent,
                 OrdersComponent,
                 OrderDeatilComponent,
                 ProfileAddressComponent],
  imports: [
    CommonModule,
    PipesModule,
    CardsModule,
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
  providers : [],
  entryComponents: []
})
export class ProfileModule {
}
