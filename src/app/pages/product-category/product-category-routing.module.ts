
import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import { ProductCategoryComponent } from './product-category.component';
import { ProductCategoryGuard } from './product-category.guard';
import { NavRoute } from 'src/app/services/navigation/nav-routing';

export const catRoutes: NavRoute[] = [
  {data: {title: 'Sub Category' , isChild: true},
   path: ':category', 
   component: ProductCategoryComponent , 
   canActivate: [ProductCategoryGuard]}
];

@NgModule({
  imports: [RouterModule.forChild(catRoutes)],
  exports: [RouterModule],
})
export class ProductCategoryRoutingModule {
}
