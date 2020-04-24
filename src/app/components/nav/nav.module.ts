import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavComponent } from './nav.component';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NavMenuItemComponent } from './nav-menu-item/nav-menu-item.component';
import { NavToolbarComponent } from './nav-toolbar/nav-toolbar.component';
import { MatBadgeModule, MatExpansionModule, MatMenuModule, MatGridListModule, MatCardModule } from '@angular/material';
import { PipesModule } from '../pipes/pipes.module';
import { BreadCrumbsComponent } from './bread-crumbs/bread-crumbs.component';
import { TranslateModule } from '@ngx-translate/core';
import { CartCardComponent } from './cart-cards/cart-card/cart-card.component';
import { CartCardsSpawnerComponent } from './cart-cards/cart-cards-spawner/cart-cards-spawner.component';
import { CartCardsService } from './cart-cards/product-cards.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [NavComponent, 
                 NavMenuItemComponent, 
                 NavToolbarComponent,
                 BreadCrumbsComponent,
                 CartCardComponent,
                 CartCardsSpawnerComponent],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    MatSidenavModule,
    FlexLayoutModule,
    MatListModule,
    MatGridListModule,
    MatCardModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatExpansionModule,
    MatMenuModule,
    MatBadgeModule,
    PipesModule
  ],
  providers : [CartCardsService],
  exports:[BreadCrumbsComponent],
  entryComponents: [CartCardComponent]
})
export class NavModule {
}
