
import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import { ProfileComponent } from './profile.component';
import { AccountComponent } from './components/account/account.component';
import { AddressComponent } from './components/address/address.component';
import { FavoritesComponent } from './components/favorites/favorites.component';
import { OrdersComponent } from './components/orders/orders.component';

const routes: Routes = [{path: '', component: ProfileComponent,
                        children:[{path: 'profile', component: AccountComponent},
                                  {path: 'addressinfo', component: AddressComponent},
                                  {path: 'favorites', component: FavoritesComponent},
                                  {path: 'orders', component: OrdersComponent}]},
                                  ];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfileRoutingModule {
}
