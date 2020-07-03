
import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import { ProfileComponent } from './profile.component';
import { FavoritesComponent } from './components/favorites/favorites.component';
import { OrdersComponent } from './components/orders/orders.component';
import { OrderDeatilComponent } from './components/orders/order-details/order-detail.component';
import { AddressFormComponent } from 'src/app/components/address/address-form/address.component';
import { AccountOverviewComponent } from './components/overview/account.component';
import { AccountComponent } from './components/account/account.component';

const routes: Routes = [{path: '', component: ProfileComponent,
                        children:[{path: 'overview', component: AccountOverviewComponent},
                                  {path: 'profile', component: AccountComponent},
                                  {path: 'addressinfo', component: AddressFormComponent},
                                  {path: 'favorites', component: FavoritesComponent},
                                  {path: 'orders', component: OrdersComponent},
                                  {path: 'orders/:orderId', component: OrderDeatilComponent}]},
                                  ];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfileRoutingModule {
}
