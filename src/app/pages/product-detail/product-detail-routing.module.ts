
import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import { NavRoute } from 'src/app/services/navigation/nav-routing';
import { ProductDeatilComponent } from './product-detail.component';
import { ProductDetailGuard } from './product-detail.guard';

export const catRoutes: NavRoute[] = [
  {data: {title: 'Product Details' , isChild: true},
   path: ':product', 
   component: ProductDeatilComponent , 
   canActivate: [ProductDetailGuard]}
];

@NgModule({
  imports: [RouterModule.forChild(catRoutes)],
  exports: [RouterModule],
})
export class ProductDetailRoutingModule {
}